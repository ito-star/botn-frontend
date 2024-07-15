import { useNavigate } from 'react-router-dom'

export const Navigate = () => {
  const navigate = useNavigate()
  return {
    push: (path) => navigate(path),
    replace: (path) => navigate(path, { replace: true }),
  }
}
