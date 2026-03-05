import React from 'react';
import Head from 'next/head';
import {
  AppProvider,
  Page,
  Layout,
  Card,
  Text,
  DataTable,
  Badge,
  Pagination,
  Filters,
  LegacyStack as Stack
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { useState } from 'react';

const translations = {
  Polaris: {
    Common: {
      loading: 'Loading...'
    }
  }
};

// Mock customer journey data
const mockJourneys = [
  {
    id: 'journey_001',
    customerId: 'cust_12345',
    touchpoints: 5,
    revenue: 450.00,
    converted: true,
    firstTouch: { channel: 'meta', date: '2024-01-15' },
    lastTouch: { channel: 'email', date: '2024-01-20' },
    timeToConvert: '5 days',
    path: ['Meta Ads', 'Google Search', 'Email', 'Direct', 'Email']
  },
  {
    id: 'journey_002',
    customerId: 'cust_12346',
    touchpoints: 3,
    revenue: 120.00,
    converted: true,
    firstTouch: { channel: 'google', date: '2024-01-18' },
    lastTouch: { channel: 'direct', date: '2024-01-19' },
    timeToConvert: '1 day',
    path: ['Google Search', 'Direct', 'Direct']
  },
  {
    id: 'journey_003',
    customerId: 'cust_12347',
    touchpoints: 7,
    revenue: 890.00,
    converted: true,
    firstTouch: { channel: 'tiktok', date: '2024-01-10' },
    lastTouch: { channel: 'google_ads', date: '2024-01-22' },
    timeToConvert: '12 days',
    path: ['TikTok', 'Meta Ads', 'Google Search', 'Email', 'Direct', 'Google Ads', 'Google Ads']
  },
  {
    id: 'journey_004',
    customerId: 'cust_12348',
    touchpoints: 2,
    revenue: 65.00,
    converted: true,
    firstTouch: { channel: 'email', date: '2024-01-19' },
    lastTouch: { channel: 'direct', date: '2024-01-19' },
    timeToConvert: '2 hours',
    path: ['Email', 'Direct']
  },
  {
    id: 'journey_005',
    customerId: 'cust_12349',
    touchpoints: 4,
    revenue: 340.00,
    converted: true,
    firstTouch: { channel: 'meta', date: '2024-01-14' },
    lastTouch: { channel: 'meta', date: '2024-01-17' },
    timeToConvert: '3 days',
    path: ['Meta Ads', 'Meta Ads', 'Instagram', 'Meta Ads']
  }
];

export default function Journeys() {
  const [journeys] = useState(mockJourneys);
  const [filteredJourneys, setFilteredJourneys] = useState(mockJourneys);
  const [queryValue, setQueryValue] = useState('');

  const handleFiltersChange = (value) => {
    setQueryValue(value);
    if (!value) {
      setFilteredJourneys(journeys);
      return;
    }
    
    const filtered = journeys.filter(j => 
      j.customerId.toLowerCase().includes(value.toLowerCase()) ||
      j.firstTouch.channel.toLowerCase().includes(value.toLowerCase()) ||
      j.lastTouch.channel.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredJourneys(filtered);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getChannelBadge = (channel) => {
    const toneMap = {
      meta: 'info',
      google: 'success',
      google_ads: 'success',
      email: 'warning',
      tiktok: 'critical',
      direct: 'new',
      organic: 'success'
    };
    return <Badge tone={toneMap[channel] || 'default'}>{channel}</Badge>;
  };

  const rows = filteredJourneys.map(journey => [
    journey.customerId,
    getChannelBadge(journey.firstTouch.channel),
    getChannelBadge(journey.lastTouch.channel),
    journey.touchpoints,
    formatCurrency(journey.revenue),
    journey.timeToConvert,
    <Text key={journey.id} variant="bodySm" as="span" tone="subdued">
      {journey.path.join(' → ')}
    </Text>
  ]);

  return (
    <AppProvider i18n={translations}>
      <Head>
        <title>Customer Journeys</title>
      </Head>
      <Page
        title="Customer Journeys"
        subtitle="View complete customer conversion paths"
        primaryAction={{ content: 'Export CSV', onAction: () => {} }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ padding: '16px' }}>
                <Filters
                  queryValue={queryValue}
                  filters={[]}
                  onQueryChange={handleFiltersChange}
                  onQueryClear={() => handleFiltersChange('')}
                />
              </div>
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'numeric', 'numeric', 'text', 'text']}
                headings={[
                  'Customer ID',
                  'First Touch',
                  'Last Touch',
                  'Touchpoints',
                  'Revenue',
                  'Time to Convert',
                  'Journey Path'
                ]}
                rows={rows}
              />
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  hasPrevious
                  onPrevious={() => {}}
                  hasNext
                  onNext={() => {}}
                />
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
