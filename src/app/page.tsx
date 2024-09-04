"use client;"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useCounter from '@/lib/hooks/useCounter'; // Custom hook for the job hunt counter

const HomePage: React.FC = () => {
  const daysSinceStart = useCounter(new Date('2023-09-01'));

  return (
    <div className="container mx-auto px-4">
      <header className="my-12">
        <h1 className="text-4xl font-bold text-center">I Want To Be an AI Engineer</h1>
        <p className="text-xl text-center mt-4">
          It's been <span className="font-bold text-red-600">{daysSinceStart}</span> days since I started my quest.
          <br />
          This counter stops the day I get hired. No pressure, right?
        </p>
      </header>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Who Am I?</CardTitle>
          <CardDescription className="text-base">
            Just another AI enthusiast caught in the loop of "Hello World" tutorials. But not for long!
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-50">
          <p className="text-md">
            I’m a junior developer diving deep into the world of artificial intelligence, aiming to pivot my curiosity and code into a full-time career. 
            Here's where I share the ups, downs, and code snippets that keep me up at night.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="mt-4" onClick={() => console.log('Navigate to About')}>Learn More About My Misadventures</Button>
        </CardFooter>
      </Card>

      <section className="mt-10">
        {/* Placeholder for Blog Section */}
      </section>

      <footer className="mt-10 text-center">
        <p>Want to see if I ever make it? Follow me or drop a line!</p>
        <div className="space-x-4 mt-2">
          <Button onClick={() => console.log('Navigate to Twitter')}>Twitter</Button>
          <Button onClick={() => console.log('Navigate to LinkedIn')}>LinkedIn</Button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
