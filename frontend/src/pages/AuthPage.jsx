import Login from "../components/Login"
import Signup from "../components/Signup"
import authScreenAtom from "../atoms/authAtom"
import {useRecoilValue} from 'recoil'
const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  console.log(authScreenState)
  return (
    <div>
        {
          authScreenState==='login'?<Login />:<Signup />
        }
    </div>
  )
}

export default AuthPage