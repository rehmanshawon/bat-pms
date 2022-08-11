//import Signin from "../components/Signin";
import dynamic from 'next/dynamic'
import { Suspense } from 'react';
const Signin = dynamic(() => import('../components/Signin'), {
  suspense: true,
})

const SigninPage = () =>(
    <Suspense fallback={`Loading...`}> 
        <Signin />
    </Suspense>
)

export default SigninPage;
