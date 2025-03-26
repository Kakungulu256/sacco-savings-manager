
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RefreshCw, Database, Shield, Bell, Mail, Settings as SettingsIcon, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

// Mock settings data
const MOCK_SETTINGS = {
  general: {
    organizationName: 'Sacco Financial Services',
    contactEmail: 'info@saccoapp.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Financial Street, Banking City, BC 12345',
    logoUrl: '/logo.png',
  },
  security: {
    requireMfa: false,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 30,
    failedLoginAttempts: 5,
    ipRestriction: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    savingsNotifications: true,
    loanNotifications: true,
    marketingNotifications: false,
  },
  loans: {
    defaultInterestRate: 10,
    maxLoanAmount: 100000,
    maxLoanTermMonths: 36,
    minCreditScore: 650,
    requireCollateral: false,
  },
  savings: {
    interestRate: 3.5,
    minimumBalance: 1000,
    withdrawalFee: 2.5,
    earlyWithdrawalPenalty: 5,
    compoundingPeriod: 'monthly',
  },
  maintenance: {
    backupFrequency: 'daily',
    maintenanceTime: '02:00',
    maintenanceDay: 'sunday',
    dataRetentionMonths: 60,
    enableMaintenance: false,
  },
};

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [activeTab, setActiveTab] = useState('general');

  // Redirect non-admin users
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleSaveSettings = () => {
    // In a real app, this would send the updated settings to the server
    toast.success('Settings saved successfully');
  };

  const handleGeneralSettingsChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [field]: value,
      },
    });
  };

  const handleSecuritySettingsChange = (field: string, value: boolean | number) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [field]: value,
      },
    });
  };

  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value,
      },
    });
  };

  const handleLoanSettingsChange = (field: string, value: number | boolean) => {
    setSettings({
      ...settings,
      loans: {
        ...settings.loans,
        [field]: value,
      },
    });
  };

  const handleSavingsSettingsChange = (field: string, value: number | string) => {
    setSettings({
      ...settings,
      savings: {
        ...settings.savings,
        [field]: value,
      },
    });
  };

  const handleMaintenanceSettingsChange = (field: string, value: string | number | boolean) => {
    setSettings({
      ...settings,
      maintenance: {
        ...settings.maintenance,
        [field]: value,
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="loans">Loan Settings</TabsTrigger>
            <TabsTrigger value="savings">Savings Settings</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Manage basic organization information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={settings.general.organizationName}
                    onChange={(e) => handleGeneralSettingsChange('organizationName', e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleGeneralSettingsChange('contactEmail', e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.general.contactPhone}
                    onChange={(e) => handleGeneralSettingsChange('contactPhone', e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.general.address}
                    onChange={(e) => handleGeneralSettingsChange('address', e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={settings.general.logoUrl}
                    onChange={(e) => handleGeneralSettingsChange('logoUrl', e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure system security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireMfa">Require Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce MFA for all users of the system
                    </p>
                  </div>
                  <Switch
                    id="requireMfa"
                    checked={settings.security.requireMfa}
                    onCheckedChange={(checked) => handleSecuritySettingsChange('requireMfa', checked)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                  <Input
                    id="passwordExpiryDays"
                    type="number"
                    value={settings.security.passwordExpiryDays}
                    onChange={(e) => handleSecuritySettingsChange('passwordExpiryDays', parseInt(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    value={settings.security.sessionTimeoutMinutes}
                    onChange={(e) => handleSecuritySettingsChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="failedLoginAttempts">Failed Login Attempts Before Lockout</Label>
                  <Input
                    id="failedLoginAttempts"
                    type="number"
                    value={settings.security.failedLoginAttempts}
                    onChange={(e) => handleSecuritySettingsChange('failedLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ipRestriction">Enable IP Restriction</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict login to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    id="ipRestriction"
                    checked={settings.security.ipRestriction}
                    onCheckedChange={(checked) => handleSecuritySettingsChange('ipRestriction', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('smsNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="savingsNotifications">Savings Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify users about savings activities
                    </p>
                  </div>
                  <Switch
                    id="savingsNotifications"
                    checked={settings.notifications.savingsNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('savingsNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="loanNotifications">Loan Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify users about loan activities
                    </p>
                  </div>
                  <Switch
                    id="loanNotifications"
                    checked={settings.notifications.loanNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('loanNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingNotifications">Marketing Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send promotional and marketing messages
                    </p>
                  </div>
                  <Switch
                    id="marketingNotifications"
                    checked={settings.notifications.marketingNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('marketingNotifications', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Loan Settings
                </CardTitle>
                <CardDescription>Configure loan parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="defaultInterestRate">Default Interest Rate (%)</Label>
                  <Input
                    id="defaultInterestRate"
                    type="number"
                    value={settings.loans.defaultInterestRate}
                    onChange={(e) => handleLoanSettingsChange('defaultInterestRate', parseFloat(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="maxLoanAmount">Maximum Loan Amount</Label>
                  <Input
                    id="maxLoanAmount"
                    type="number"
                    value={settings.loans.maxLoanAmount}
                    onChange={(e) => handleLoanSettingsChange('maxLoanAmount', parseInt(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="maxLoanTermMonths">Maximum Loan Term (Months)</Label>
                  <Input
                    id="maxLoanTermMonths"
                    type="number"
                    value={settings.loans.maxLoanTermMonths}
                    onChange={(e) => handleLoanSettingsChange('maxLoanTermMonths', parseInt(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="minCreditScore">Minimum Credit Score</Label>
                  <Input
                    id="minCreditScore"
                    type="number"
                    value={settings.loans.minCreditScore}
                    onChange={(e) => handleLoanSettingsChange('minCreditScore', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireCollateral">Require Collateral</Label>
                    <p className="text-sm text-muted-foreground">
                      Require collateral for loans above a certain amount
                    </p>
                  </div>
                  <Switch
                    id="requireCollateral"
                    checked={settings.loans.requireCollateral}
                    onCheckedChange={(checked) => handleLoanSettingsChange('requireCollateral', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Loan Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="savings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Savings Settings
                </CardTitle>
                <CardDescription>Configure savings account parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={settings.savings.interestRate}
                    onChange={(e) => handleSavingsSettingsChange('interestRate', parseFloat(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="minimumBalance">Minimum Balance</Label>
                  <Input
                    id="minimumBalance"
                    type="number"
                    value={settings.savings.minimumBalance}
                    onChange={(e) => handleSavingsSettingsChange('minimumBalance', parseInt(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="withdrawalFee">Withdrawal Fee (%)</Label>
                  <Input
                    id="withdrawalFee"
                    type="number"
                    step="0.1"
                    value={settings.savings.withdrawalFee}
                    onChange={(e) => handleSavingsSettingsChange('withdrawalFee', parseFloat(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="earlyWithdrawalPenalty">Early Withdrawal Penalty (%)</Label>
                  <Input
                    id="earlyWithdrawalPenalty"
                    type="number"
                    step="0.1"
                    value={settings.savings.earlyWithdrawalPenalty}
                    onChange={(e) => handleSavingsSettingsChange('earlyWithdrawalPenalty', parseFloat(e.target.value))}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="compoundingPeriod">Compounding Period</Label>
                  <Select
                    value={settings.savings.compoundingPeriod}
                    onValueChange={(value) => handleSavingsSettingsChange('compoundingPeriod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compounding period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Savings Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Maintenance
                </CardTitle>
                <CardDescription>Configure system maintenance and backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={settings.maintenance.backupFrequency}
                    onValueChange={(value) => handleMaintenanceSettingsChange('backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="maintenanceTime">Maintenance Time</Label>
                  <Input
                    id="maintenanceTime"
                    type="time"
                    value={settings.maintenance.maintenanceTime}
                    onChange={(e) => handleMaintenanceSettingsChange('maintenanceTime', e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="maintenanceDay">Maintenance Day</Label>
                  <Select
                    value={settings.maintenance.maintenanceDay}
                    onValueChange={(value) => handleMaintenanceSettingsChange('maintenanceDay', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select maintenance day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="dataRetentionMonths">Data Retention Period (Months)</Label>
                  <Input
                    id="dataRetentionMonths"
                    type="number"
                    value={settings.maintenance.dataRetentionMonths}
                    onChange={(e) => handleMaintenanceSettingsChange('dataRetentionMonths', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableMaintenance" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      Maintenance Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode (site will be unavailable)
                    </p>
                  </div>
                  <Switch
                    id="enableMaintenance"
                    checked={settings.maintenance.enableMaintenance}
                    onCheckedChange={(checked) => handleMaintenanceSettingsChange('enableMaintenance', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => toast.success('System backup initiated')}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Backup Now
                </Button>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Maintenance Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
