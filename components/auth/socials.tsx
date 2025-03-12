"use client";

import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from "react-icons/fa";
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export const Socials = () => {
    const onClick = (provider : "google"| "github") => {
        signIn(provider,{
            callbackUrl : DEFAULT_LOGIN_REDIRECT
        });


    }
    return(
    <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full" onClick={ () => onClick("google") } >
            <FcGoogle className="mr-2 h-4 w-4" />
                Google
        </Button>
        <Button variant="outline" className="w-full" onClick={ () => onClick("github") }>
            <FaGithub className="mr-2 h-4 w-4" />
                GitHub
        </Button>
    </div>
    );
}
