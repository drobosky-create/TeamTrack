import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Image, 
  Type, 
  Layout, 
  Save, 
  Upload,
  Globe,
  Phone,
  Mail,
  Code,
  Eye,
  RefreshCw
} from "lucide-react";
import type { OrganizationBranding, UpdateOrganizationBranding } from "@shared/schema";

export default function BrandingPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateOrganizationBranding>({});
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch current branding
  const { data: branding, isLoading: brandingLoading } = useQuery({
    queryKey: ['/api/branding'],
    enabled: isAuthenticated,
  });

  // Update form data when branding loads
  useEffect(() => {
    if (branding) {
      setFormData({
        organizationName: branding.organizationName || '',
        organizationTagline: branding.organizationTagline || '',
        logoUrl: branding.logoUrl || '',
        faviconUrl: branding.faviconUrl || '',
        bannerUrl: branding.bannerUrl || '',
        primaryColor: branding.primaryColor || '#3b82f6',
        secondaryColor: branding.secondaryColor || '#64748b',
        accentColor: branding.accentColor || '#10b981',
        backgroundColor: branding.backgroundColor || '#ffffff',
        textColor: branding.textColor || '#1f2937',
        primaryFont: branding.primaryFont || 'Inter',
        headingFont: branding.headingFont || 'Inter',
        sidebarColor: branding.sidebarColor || '#f8fafc',
        headerColor: branding.headerColor || '#ffffff',
        cardColor: branding.cardColor || '#ffffff',
        footerText: branding.footerText || '',
        supportEmail: branding.supportEmail || '',
        supportPhone: branding.supportPhone || '',
        websiteUrl: branding.websiteUrl || '',
        customCss: branding.customCss || '',
      });
    }
  }, [branding]);

  // Update branding mutation
  const updateBrandingMutation = useMutation({
    mutationFn: async (data: UpdateOrganizationBranding) => {
      return await apiRequest('/api/branding', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/branding'] });
      toast({
        title: "Branding Updated",
        description: "Your organization's branding has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update branding settings.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof UpdateOrganizationBranding, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateBrandingMutation.mutate(formData);
  };

  const applyPreviewStyles = () => {
    if (!previewMode) return;
    
    const root = document.documentElement;
    if (formData.primaryColor) root.style.setProperty('--primary', formData.primaryColor);
    if (formData.backgroundColor) root.style.setProperty('--background', formData.backgroundColor);
    if (formData.textColor) root.style.setProperty('--foreground', formData.textColor);
  };

  useEffect(() => {
    applyPreviewStyles();
  }, [formData, previewMode]);

  if (isLoading || brandingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access branding settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="heading-branding">White-Label Branding</h1>
            <p className="text-gray-600 text-sm mt-1">Customize your organization's appearance and branding</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
              data-testid="button-preview-toggle"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? 'Disable Preview' : 'Preview Mode'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateBrandingMutation.isPending}
              className="flex items-center gap-2"
              data-testid="button-save-branding"
            >
              {updateBrandingMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="visuals" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Visuals
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={formData.organizationName || ''}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="PerformanceHub"
                    data-testid="input-organization-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.organizationTagline || ''}
                    onChange={(e) => handleInputChange('organizationTagline', e.target.value)}
                    placeholder="Empowering teams through performance"
                    data-testid="input-tagline"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <div className="flex">
                    <Mail className="h-4 w-4 mt-3 mr-2 text-gray-400" />
                    <Input
                      id="supportEmail"
                      type="email"
                      value={formData.supportEmail || ''}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      placeholder="support@company.com"
                      data-testid="input-support-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <div className="flex">
                    <Phone className="h-4 w-4 mt-3 mr-2 text-gray-400" />
                    <Input
                      id="supportPhone"
                      value={formData.supportPhone || ''}
                      onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      data-testid="input-support-phone"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <div className="flex">
                    <Globe className="h-4 w-4 mt-3 mr-2 text-gray-400" />
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={formData.websiteUrl || ''}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://company.com"
                      data-testid="input-website-url"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  value={formData.footerText || ''}
                  onChange={(e) => handleInputChange('footerText', e.target.value)}
                  placeholder="© 2025 Your Organization. All rights reserved."
                  rows={3}
                  data-testid="textarea-footer-text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visuals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Visual Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logoUrl"
                      value={formData.logoUrl || ''}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      placeholder="https://company.com/logo.png"
                      data-testid="input-logo-url"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.logoUrl && (
                    <div className="mt-2 p-2 border rounded">
                      <img 
                        src={formData.logoUrl} 
                        alt="Logo Preview" 
                        className="h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="faviconUrl"
                      value={formData.faviconUrl || ''}
                      onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                      placeholder="https://company.com/favicon.ico"
                      data-testid="input-favicon-url"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.faviconUrl && (
                    <div className="mt-2 p-2 border rounded">
                      <img 
                        src={formData.faviconUrl} 
                        alt="Favicon Preview" 
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bannerUrl">Banner URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bannerUrl"
                      value={formData.bannerUrl || ''}
                      onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                      placeholder="https://company.com/banner.jpg"
                      data-testid="input-banner-url"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.bannerUrl && (
                    <div className="mt-2 p-2 border rounded">
                      <img 
                        src={formData.bannerUrl} 
                        alt="Banner Preview" 
                        className="h-16 w-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor || '#3b82f6'}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-16"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={formData.primaryColor || '#3b82f6'}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor || '#64748b'}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-16"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      value={formData.secondaryColor || '#64748b'}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      placeholder="#64748b"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.accentColor || '#10b981'}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-16"
                      data-testid="input-accent-color"
                    />
                    <Input
                      value={formData.accentColor || '#10b981'}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.backgroundColor || '#ffffff'}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-16"
                      data-testid="input-background-color"
                    />
                    <Input
                      value={formData.backgroundColor || '#ffffff'}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={formData.textColor || '#1f2937'}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-16"
                      data-testid="input-text-color"
                    />
                    <Input
                      value={formData.textColor || '#1f2937'}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sidebarColor">Sidebar Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sidebarColor"
                      type="color"
                      value={formData.sidebarColor || '#f8fafc'}
                      onChange={(e) => handleInputChange('sidebarColor', e.target.value)}
                      className="w-16"
                      data-testid="input-sidebar-color"
                    />
                    <Input
                      value={formData.sidebarColor || '#f8fafc'}
                      onChange={(e) => handleInputChange('sidebarColor', e.target.value)}
                      placeholder="#f8fafc"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headerColor">Header Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="headerColor"
                      type="color"
                      value={formData.headerColor || '#ffffff'}
                      onChange={(e) => handleInputChange('headerColor', e.target.value)}
                      className="w-16"
                      data-testid="input-header-color"
                    />
                    <Input
                      value={formData.headerColor || '#ffffff'}
                      onChange={(e) => handleInputChange('headerColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardColor">Card Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cardColor"
                      type="color"
                      value={formData.cardColor || '#ffffff'}
                      onChange={(e) => handleInputChange('cardColor', e.target.value)}
                      className="w-16"
                      data-testid="input-card-color"
                    />
                    <Input
                      value={formData.cardColor || '#ffffff'}
                      onChange={(e) => handleInputChange('cardColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryFont">Primary Font</Label>
                  <Input
                    id="primaryFont"
                    value={formData.primaryFont || 'Inter'}
                    onChange={(e) => handleInputChange('primaryFont', e.target.value)}
                    placeholder="Inter, sans-serif"
                    data-testid="input-primary-font"
                  />
                  <p className="text-sm text-gray-500">Font family for body text</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headingFont">Heading Font</Label>
                  <Input
                    id="headingFont"
                    value={formData.headingFont || 'Inter'}
                    onChange={(e) => handleInputChange('headingFont', e.target.value)}
                    placeholder="Inter, sans-serif"
                    data-testid="input-heading-font"
                  />
                  <p className="text-sm text-gray-500">Font family for headings</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-2">Typography Preview</h3>
                <div style={{ fontFamily: formData.primaryFont || 'Inter' }}>
                  <h1 style={{ fontFamily: formData.headingFont || 'Inter' }} className="text-2xl font-bold mb-2">
                    Heading Example
                  </h1>
                  <p className="text-base mb-2">
                    This is a sample paragraph using your selected primary font. It demonstrates how body text will appear across your application.
                  </p>
                  <p className="text-sm text-gray-600">
                    This is smaller text that might be used for captions or secondary information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Advanced Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  value={formData.customCss || ''}
                  onChange={(e) => handleInputChange('customCss', e.target.value)}
                  placeholder="/* Add custom CSS here */
.custom-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 25px;
}"
                  rows={10}
                  className="font-mono text-sm"
                  data-testid="textarea-custom-css"
                />
                <p className="text-sm text-gray-500">
                  Add custom CSS to override default styles. Use with caution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}