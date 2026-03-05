import React, { useState } from 'react';
import Head from 'next/head';
import {
  AppProvider,
  Page,
  Layout,
  Card,
  Text,
  FormLayout,
  Select,
  TextField,
  Checkbox,
  Button,
  LegacyStack as Stack,
  Banner,
  CodeBlock
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

const translations = {
  Polaris: {
    Common: {
      loading: 'Loading...',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save'
    }
  }
};

export default function Settings() {
  const [settings, setSettings] = useState({
    defaultAttributionModel: 'last_click',
    attributionWindowDays: 30,
    dataRetentionDays: 365,
    enableDataDriven: false,
    enableEmailTracking: true
  });

  const [showBanner, setShowBanner] = useState(false);

  const handleSave = () => {
    // API call would go here
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 3000);
  };

  const trackingScript = `<!-- Attribution Tracking -->
<script src="https://your-app.com/tracking.js" 
  data-shop="YOUR_SHOP_DOMAIN"
  async>
</script>`;

  return (
    <AppProvider i18n={translations}>
      <Head>
        <title>Attribution Settings</title>
      </Head>
      <Page
        title="Settings"
        subtitle="Configure your attribution tracking preferences"
      >
        <Layout>
          {showBanner && (
            <Layout.Section>
              <Banner title="Settings saved successfully" tone="success" onDismiss={() => setShowBanner(false)} />
            </Layout.Section>
          )}

          <Layout.Section>
            <Card sectioned title="Attribution Configuration">
              <FormLayout>
                <Select
                  label="Default Attribution Model"
                  options={[
                    { label: 'First Click - 100% credit to first touchpoint', value: 'first_click' },
                    { label: 'Last Click - 100% credit to last touchpoint', value: 'last_click' },
                    { label: 'Linear - Equal credit to all touchpoints', value: 'linear' },
                    { label: 'Time Decay - More credit to recent touchpoints', value: 'time_decay' }
                  ]}
                  value={settings.defaultAttributionModel}
                  onChange={(val) => setSettings({ ...settings, defaultAttributionModel: val })}
                  helpText="This model will be used by default when calculating attribution"
                />

                <TextField
                  label="Attribution Window (Days)"
                  type="number"
                  value={settings.attributionWindowDays.toString()}
                  onChange={(val) => setSettings({ ...settings, attributionWindowDays: parseInt(val) || 30 })}
                  helpText="Number of days to look back for touchpoints before an order"
                  min={1}
                  max={90}
                />

                <TextField
                  label="Data Retention (Days)"
                  type="number"
                  value={settings.dataRetentionDays.toString()}
                  onChange={(val) => setSettings({ ...settings, dataRetentionDays: parseInt(val) || 365 })}
                  helpText="How long to keep attribution data (GDPR compliance)"
                  min={30}
                  max={1095}
                />
              </FormLayout>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned title="Feature Settings">
              <FormLayout>
                <Checkbox
                  label="Enable Data-Driven Attribution (Beta)"
                  checked={settings.enableDataDriven}
                  onChange={(val) => setSettings({ ...settings, enableDataDriven: val })}
                  helpText="Uses machine learning to calculate optimal attribution weights"
                />

                <Checkbox
                  label="Enable Email Tracking"
                  checked={settings.enableEmailTracking}
                  onChange={(val) => setSettings({ ...settings, enableEmailTracking: val })}
                  helpText="Track email opens and clicks for attribution"
                />
              </FormLayout>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned title="Installation">
              <Text variant="bodyMd" as="p">
                Add this script to your Shopify theme&apos;s <code>&lt;head&gt;</code> section:
              </Text>
              <div style={{ marginTop: '10px' }}>
                <CodeBlock>{trackingScript}</CodeBlock>
              </div>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Stack distribution="trailing">
              <Button onClick={() => window.location.reload()}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Save Settings</Button>
            </Stack>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
