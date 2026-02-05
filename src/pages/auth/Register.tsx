 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
 import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
 import { useToast } from '@/hooks/use-toast';
 import { Loader2, Leaf, Building2, TrendingUp } from 'lucide-react';
 import { AppRole } from '@/lib/types';
 
 export default function Register() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [fullName, setFullName] = useState('');
   const [role, setRole] = useState<AppRole>('company');
   const [isLoading, setIsLoading] = useState(false);
   const { signUp } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     const { error } = await signUp(email, password, fullName, role);
 
     if (error) {
       toast({
         title: 'Error',
         description: error.message,
         variant: 'destructive',
       });
       setIsLoading(false);
       return;
     }
 
     toast({
       title: 'Account created!',
       description: 'Please check your email to verify your account.',
     });
     navigate('/login');
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
           <CardTitle className="text-2xl">Create an account</CardTitle>
           <CardDescription>Get started with ESG scoring and analytics</CardDescription>
         </CardHeader>
         <form onSubmit={handleSubmit}>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="fullName">Full Name</Label>
               <Input
                 id="fullName"
                 placeholder="John Doe"
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 required
               />
             </div>
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
                 minLength={6}
                 required
               />
             </div>
             <div className="space-y-3">
               <Label>I am a...</Label>
               <RadioGroup value={role} onValueChange={(v) => setRole(v as AppRole)} className="grid grid-cols-2 gap-4">
                 <Label
                   htmlFor="role-company"
                   className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                     role === 'company' ? 'border-primary bg-accent' : 'border-muted'
                   }`}
                 >
                   <RadioGroupItem value="company" id="role-company" className="sr-only" />
                   <Building2 className="h-8 w-8 mb-2" />
                   <span className="font-medium">Company</span>
                   <span className="text-xs text-muted-foreground">Self-assess ESG</span>
                 </Label>
                 <Label
                   htmlFor="role-investor"
                   className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                     role === 'investor' ? 'border-primary bg-accent' : 'border-muted'
                   }`}
                 >
                   <RadioGroupItem value="investor" id="role-investor" className="sr-only" />
                   <TrendingUp className="h-8 w-8 mb-2" />
                   <span className="font-medium">Investor</span>
                   <span className="text-xs text-muted-foreground">Analyze companies</span>
                 </Label>
               </RadioGroup>
             </div>
           </CardContent>
           <CardFooter className="flex flex-col space-y-4">
             <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Create account
             </Button>
             <p className="text-sm text-muted-foreground">
               Already have an account?{' '}
               <Link to="/login" className="text-primary hover:underline">
                 Sign in
               </Link>
             </p>
           </CardFooter>
         </form>
       </Card>
     </div>
   );
 }