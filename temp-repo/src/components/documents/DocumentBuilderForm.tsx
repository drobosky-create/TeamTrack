import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocuments } from '@/hooks/useDocuments';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  state: z.string().min(1, 'State is required'),
  businessPurpose: z.string().min(1, 'Business purpose is required'),
  members: z.array(z.object({
    name: z.string().min(1, 'Member name is required'),
    ownershipPercentage: z.number().min(0).max(100),
    address: z.string().min(1, 'Address is required'),
  })).min(1, 'At least one member is required'),
  managementStructure: z.enum(['member-managed', 'manager-managed']),
  votingRights: z.string().min(1, 'Voting rights description is required'),
  distributionRights: z.string().min(1, 'Distribution rights description is required'),
  transferRestrictions: z.string().min(1, 'Transfer restrictions are required'),
  dissolutionTerms: z.string().min(1, 'Dissolution terms are required'),
});

interface DocumentBuilderFormProps {
  onSuccess: () => void;
}

export const DocumentBuilderForm = ({ onSuccess }: DocumentBuilderFormProps) => {
  const [saving, setSaving] = useState(false);
  const { createInternalDocument } = useDocuments();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      companyName: '',
      state: '',
      businessPurpose: '',
      members: [{ name: '', ownershipPercentage: 0, address: '' }],
      managementStructure: 'member-managed',
      votingRights: '',
      distributionRights: '',
      transferRestrictions: '',
      dissolutionTerms: '',
    },
  });

  const members = form.watch('members');

  const addMember = () => {
    const currentMembers = form.getValues('members');
    form.setValue('members', [...currentMembers, { name: '', ownershipPercentage: 0, address: '' }]);
  };

  const removeMember = (index: number) => {
    const currentMembers = form.getValues('members');
    form.setValue('members', currentMembers.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true);
    try {
      await createInternalDocument({
        title: values.title,
        description: values.description,
        content: {
          companyInfo: {
            name: values.companyName,
            state: values.state,
            businessPurpose: values.businessPurpose,
          },
          members: values.members,
          governance: {
            managementStructure: values.managementStructure,
            votingRights: values.votingRights,
            distributionRights: values.distributionRights,
          },
          restrictions: {
            transferRestrictions: values.transferRestrictions,
            dissolutionTerms: values.dissolutionTerms,
          },
        },
      });
      onSuccess();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="legal">Legal Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Operating Agreement Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Document description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your LLC Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State of Formation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Delaware, California" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Purpose</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the purpose and nature of your business" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Members & Ownership</CardTitle>
                  <Button type="button" variant="outline" onClick={addMember}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {members.map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Member {index + 1}</h4>
                      {members.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMember(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Member name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`members.${index}.ownershipPercentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ownership %</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                max="100" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`members.${index}.address`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="governance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Management & Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="managementStructure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Management Structure</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full p-2 border rounded">
                          <option value="member-managed">Member-Managed</option>
                          <option value="manager-managed">Manager-Managed</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="votingRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voting Rights</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how voting rights are allocated and exercised" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distributionRights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distribution Rights</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how profits and losses are distributed" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Legal Terms & Restrictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="transferRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transfer Restrictions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe restrictions on transferring membership interests" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dissolutionTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dissolution Terms</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe conditions and procedures for dissolving the LLC" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Document
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};