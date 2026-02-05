 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
 import { useToast } from '@/hooks/use-toast';
 import { Loader2, Leaf } from 'lucide-react';
 
 export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { signIn, role } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     const { error } = await signIn(email, password);
 
     if (error) {
       toast({
         title: 'Error',
         description: error.message,
         variant: 'destructive',
       });
       setIsLoading(false);
       return;
     }
 
     toast({ title: 'Welcome back!' });
     
     // Small delay to let role fetch complete
     setTimeout(() => {
       navigate(role === 'investor' ? '/investor/dashboard' : '/company/dashboard');
     }, 500);
   };
 
   return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Card className="w-full max-w-md">
         <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
             <div className="flex items-center gap-2">
               <Leaf className="h-8 w-8 text-primary" />
               <span className="text-2xl font-bold text-foreground">ESG Platform</span>
             </div>
           </div>
           <CardTitle className="text-2xl">Sign in</CardTitle>
           <CardDescription>Enter your credentials to access your account</CardDescription>
         </CardHeader>
         <form onSubmit={handleSubmit}>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="name@company.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <Input
                 id="password"
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
           </CardContent>
           <CardFooter className="flex flex-col space-y-4">
             <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Sign in
             </Button>
             <p className="text-sm text-muted-foreground">
               Don't have an account?{' '}
               <Link to="/register" className="text-primary hover:underline">
                 Register
               </Link>
             </p>
           </CardFooter>
         </form>
       </Card>
     </div>
   );
 }