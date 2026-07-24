// 인천공항 여객예고정보 API(getPassgrAnncmt) 프록시.
// 공공데이터 API 키는 AIRPORT_API_KEY Secret으로만 읽어오며, 코드에는 절대 값을 적지 않는다.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ENDPOINT = "https://apis.data.go.kr/B551177/passgrAnncmt/getPassgrAnncmt";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// 응답은 항상 XML 고정(PRD.md §6) — items > item 하위의 평평한 태그만 파싱하면 되는 단순 구조라 정규식으로 처리한다.
function parseXml(text: string) {
  const resultCode = text.match(/<resultCode>([^<]*)<\/resultCode>/)?.[1] ?? "";
  const resultMsg = text.match(/<resultMsg>([^<]*)<\/resultMsg>/)?.[1] ?? "";

  const items: Record<string, string>[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch: RegExpExecArray | null;
  while ((itemMatch = itemRegex.exec(text)) !== null) {
    const item: Record<string, string> = {};
    const fieldRegex = /<(\w+)>([^<]*)<\/\1>/g;
    let fieldMatch: RegExpExecArray | null;
    while ((fieldMatch = fieldRegex.exec(itemMatch[1])) !== null) {
      item[fieldMatch[1]] = fieldMatch[2];
    }
    items.push(item);
  }

  return { resultCode, resultMsg, items };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  let selectdateParam = url.searchParams.get("selectdate");

  if (!selectdateParam && req.method === "POST") {
    try {
      const body = await req.json();
      if (body?.selectdate !== undefined) selectdateParam = String(body.selectdate);
    } catch {
      // 바디 없음/파싱 실패 시 아래 기본값(0)으로 처리
    }
  }

  selectdateParam = selectdateParam ?? "0";
  if (selectdateParam !== "0" && selectdateParam !== "1") {
    return jsonResponse(400, { error: "selectdate must be 0 or 1" });
  }

  const apiKey = Deno.env.get("AIRPORT_API_KEY");
  if (!apiKey) {
    return jsonResponse(500, { error: "AIRPORT_API_KEY secret이 설정되어 있지 않습니다" });
  }

  const upstreamUrl = new URL(ENDPOINT);
  upstreamUrl.searchParams.set("serviceKey", apiKey);
  upstreamUrl.searchParams.set("selectdate", selectdateParam);
  upstreamUrl.searchParams.set("numOfRows", "100");

  try {
    const upstreamResponse = await fetch(upstreamUrl.toString());
    const text = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      return jsonResponse(502, { error: `upstream HTTP ${upstreamResponse.status}` });
    }

    const { resultCode, resultMsg, items } = parseXml(text);
    if (resultCode !== "00") {
      return jsonResponse(502, { error: `upstream API error: ${resultCode} ${resultMsg}` });
    }

    return jsonResponse(200, { resultCode, resultMsg, items });
  } catch (err) {
    return jsonResponse(500, { error: err instanceof Error ? err.message : "unknown error" });
  }
});
