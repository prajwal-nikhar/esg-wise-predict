 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { useCompany } from '@/hooks/useCompany';
 import { IndustryType, CompanySize, INDUSTRY_LABELS, COMPANY_SIZE_LABELS } from '@/lib/types';
 import { Loader2, Building2 } from 'lucide-react';
 
 export default function CompanySetup() {
   const navigate = useNavigate();
   const { createCompany } = useCompany();
   const [name, setName] = useState('');
   const [industry, setIndustry] = useState<IndustryType>('technology');
   const [companySize, setCompanySize] = useState<CompanySize>('medium');
   const [description, setDescription] = useState('');
   const [location, setLocation] = useState('');
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     await createCompany.mutateAsync({
       name,
       industry,
       company_size: companySize,
       description: description || undefined,
       location: location || undefined,
     });
     navigate('/company/dashboard');
   };
 
   return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Card className="w-full max-w-lg">
         <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
             <div className="p-3 rounded-full bg-primary/10">
               <Building2 className="h-8 w-8 text-primary" />
             </div>
           </div>
           <CardTitle>Set Up Your Company Profile</CardTitle>
           <CardDescription>
             Tell us about your company to get started with ESG assessment
           </CardDescription>
         </CardHeader>
         <form onSubmit={handleSubmit}>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="name">Company Name *</Label>
               <Input
                 id="name"
                 placeholder="Acme Corp"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 required
               />
             </div>
 
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="industry">Industry *</Label>
                 <Select value={industry} onValueChange={(v) => setIndustry(v as IndustryType)}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
                       <SelectItem key={value} value={value}>
                         {label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="size">Company Size *</Label>
                 <Select value={companySize} onValueChange={(v) => setCompanySize(v as CompanySize)}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     {Object.entries(COMPANY_SIZE_LABELS).map(([value, label]) => (
                       <SelectItem key={value} value={value}>
                         {label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="location">Location</Label>
               <Input
                 id="location"
                 placeholder="San Francisco, CA"
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="description">Description</Label>
               <Textarea
                 id="description"
                 placeholder="Brief description of your company..."
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 rows={3}
               />
             </div>
 
             <Button type="submit" className="w-full" disabled={createCompany.isPending}>
               {createCompany.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Create Company Profile
             </Button>
           </CardContent>
         </form>
       </Card>
     </div>
   );
 }