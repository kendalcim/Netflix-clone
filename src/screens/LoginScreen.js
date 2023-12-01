import React, { useState } from 'react';
import './LoginScreen.css';
import SignUpScreen from './SignUpScreen';

function LoginScreen() {
    const [signIn, setSignIn] = useState(false);

    return (
        <div className='loginScreen'>
            <div className='loginScreen__background'>
                <img
                    className='loginScreen__logo'
                    src='data:image/png;base64,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'
                    alt=''>

                </img>
                <button className='loginScreen__button'
                    onClick={() => setSignIn(true)}>Sign In</button>
                <div className='loginScreen__gradient' />
                <div className='loginScreen__body'>
                    {signIn ? (
                        <SignUpScreen />
                    ) : (
                        <>
                            <h1>Unlimited films, TV programmes and more.</h1>
                            <h2>Watch anywhere. Cancel at any time.</h2>
                            <h3>
                                Ready to watch? Enter your email to create or restart your membership.
                            </h3>

                            <div className='loginScreen__input'>
                                <form>
                                    <input type='email' placeholder='Email Address' />
                                    <button className='loginScreen__getStarted'
                                        onClick={() => setSignIn(true)}
                                    >GET STARTED</button>
                                </form>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LoginScreen