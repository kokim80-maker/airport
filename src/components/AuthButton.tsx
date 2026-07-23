import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { signIn, signOut, signUp } from '../lib/auth'

type FormMode = 'login' | 'signup'

export function AuthButton() {
  const { session, loading } = useAuth()
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (loading) {
    return null
  }

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{session.user.email}</span>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setNotice(null)
    try {
      if (formMode === 'signup') {
        const data = await signUp(email, password)
        if (!data.session) {
          setNotice('가입 확인 메일을 보냈습니다. 메일함을 확인해주세요.')
        } else {
          setFormOpen(false)
        }
      } else {
        await signIn(email, password)
        setFormOpen(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!formOpen) {
    return <button onClick={() => setFormOpen(true)}>로그인</button>
  }

  return (
    <div className="card" style={{ minWidth: 240 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && <p style={{ color: 'var(--status-critical)', margin: 0 }}>{error}</p>}
        {notice && <p style={{ color: 'var(--status-good)', margin: 0 }}>{notice}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={submitting}>
            {formMode === 'signup' ? '회원가입' : '로그인'}
          </button>
          <button type="button" onClick={() => setFormOpen(false)}>
            취소
          </button>
        </div>
        <button
          type="button"
          onClick={() => setFormMode(formMode === 'signup' ? 'login' : 'signup')}
          style={{ border: 'none', background: 'none', padding: 0, textDecoration: 'underline' }}
        >
          {formMode === 'signup' ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
      </form>
    </div>
  )
}
