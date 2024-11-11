import React from 'react'
import Header from '../Header/Index'
import SignupSignin from '../SignupSignin'



const Signup = () => {
  return (
    <div>
        <Header/>
        <div className='wrapper'>
      <SignupSignin/>
        </div>
    </div>
  )
}

export default Signup