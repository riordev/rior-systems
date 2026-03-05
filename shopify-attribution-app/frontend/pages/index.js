import React from 'react';
import Head from 'next/head';
import {
  AppProvider,
  Page,
  Layout,
  Card,
  Text,
  Grid,
  LegacyStack as Stack,
  Badge,
  Tabs,
  DataTable,
  Select,
  DatePicker,
  Spinner
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format, subDays } from 'date-fns';

// Polaris translations (simplified)
const translations = {
  Polaris: {
    Common: {
      loading: 'Loading...',
      submit: 'Submit',
      cancel: 'Cancel'
    }
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const CHANNEL_COLORS = {
  meta: '#1877F2',
  google_ads: '#EA4335',
  google: '#4285F4',
  organic_search: '#34A853',
  tiktok: '#000000',
  email: '#EA4335',
  direct: '#9AA0A6',
  referral: '#FF9800',
  youtube: '#FF0000',
  other: '#9E9E9E'
};

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30');
  const [attributionModel, setAttributionModel] = useState('last_click');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, attributionModel]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In production, these would be real API calls
      // const overviewRes = await fetch(`/api/dashboard/overview?days=${timeRange}`);
      // const channelRes = await fetch(`/api/dashboard/channels?days=${timeRange}&model=${attributionModel}`);
      
      // Mock data for demonstration
      const mockData = {
        period: `${timeRange} days`,
        totalRevenue: 125430.50,
        totalOrders: 342,
        channelBreakdown: [
          { channel: 'meta', revenue: 45200, orders: 125 },
          { channel: 'google_ads', revenue: 32100, orders: 89 },
          { channel: 'email', revenue: 18500, orders: 52 },
          { channel: 'organic_search', revenue: 15600, orders: 43 },
          { channel: 'direct', revenue: 8200, orders: 23 },
          { channel: 'tiktok', revenue: 3830.50, orders: 10 }
        ],
        journeyStats: {
          avgTouchpoints: 3.4,
          avgTimeToConversion: 72.5
        },
        dailyTrend: Array.from({ length: parseInt(timeRange) }, (_, i) => ({
          date: format(subDays(new Date(), parseInt(timeRange) - i), 'MMM dd'),
          revenue: Math.random() * 5000 + 1000,
          orders: Math.floor(Math.random() * 20 + 5)
        }))
      };
      
      setData(mockData);
      setChannelData(mockData.channelBreakdown);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  const tabs = [
    {
      id: 'overview',
      content: 'Overview',
      accessibilityLabel: 'Overview tab'
    },
    {
      id: 'channels',
      content: 'Channel Performance',
      accessibilityLabel: 'Channel performance tab'
    },
    {
      id: 'journeys',
      content: 'Customer Journeys',
      accessibilityLabel: 'Customer journeys tab'
    },
    {
      id: 'comparison',
      content: 'Model Comparison',
      accessibilityLabel: 'Model comparison tab'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const renderOverview = () => (
    <>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <Card.Section>
              <Text variant="headingMd" as="h3">Total Revenue</Text>
              <Text variant="heading2xl" as="p">
                {loading ? <Spinner size="small" /> : formatCurrency(data?.totalRevenue || 0)}
              </Text>
              <Badge tone="success">+12.5% vs last period</Badge>
            </Card.Section>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <Card.Section>
              <Text variant="headingMd" as="h3">Total Orders</Text>
              <Text variant="heading2xl" as="p">
                {loading ? <Spinner size="small" /> : data?.totalOrders || 0}
              </Text>
              <Badge tone="success">+8.3% vs last period</Badge>
            </Card.Section>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <Card.Section>
              <Text variant="headingMd" as="h3">Avg Touchpoints</Text>
              <Text variant="heading2xl" as="p">
                {loading ? <Spinner size="small" /> : data?.journeyStats?.avgTouchpoints || 0}
              </Text>
              <Badge>Per conversion</Badge>
            </Card.Section>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <Card>
            <Card.Section>
              <Text variant="headingMd" as="h3">Time to Convert</Text>
              <Text variant="heading2xl" as="p">
                {loading ? <Spinner size="small" /> : `${data?.journeyStats?.avgTimeToConversion || 0}h`}
              </Text>
              <Badge>Average</Badge>
            </Card.Section>
          </Card>
        </Grid.Cell>
      </Grid>

      <div style={{ marginTop: '20px' }}>
        <Card>
          <Card.Section title="Daily Revenue Trend">
            <div style={{ height: '300px' }}>
              {!loading && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.dailyTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card.Section>
        </Card>
      </div>
    </>
  );

  const renderChannels = () => (
    <Grid>
      <Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <Card>
          <Card.Section title="Revenue by Channel">
            <div style={{ height: '300px' }}>
              {!loading && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ channel, percentage }) => `${channel}: ${percentage?.toFixed?.(1) || 0}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                      nameKey="channel"
                    >
                      {channelData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHANNEL_COLORS[entry.channel] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card.Section>
        </Card>
      </Grid.Cell>
      <Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <Card>
          <Card.Section title="Channel Performance">
            <DataTable
              columnContentTypes={['text', 'numeric', 'numeric']}
              headings={['Channel', 'Revenue', 'Orders']}
              rows={channelData.map(ch => [
                <Badge key={ch.channel}>{ch.channel}</Badge>,
                formatCurrency(ch.revenue),
                ch.orders
              ])}
            />
          </Card.Section>
        </Card>
      </Grid.Cell>
    </Grid>
  );

  const renderJourneys = () => (
    <Card>
      <Card.Section title="Recent Customer Journeys">
        <DataTable
          columnContentTypes={['text', 'numeric', 'numeric', 'text', 'text']}
          headings={['Customer ID', 'Touchpoints', 'Revenue', 'First Touch', 'Last Touch']}
          rows={[
            ['cust_12345', 5, '$450.00', 'Meta Ads', 'Email'],
            ['cust_12346', 3, '$120.00', 'Google Search', 'Direct'],
            ['cust_12347', 7, '$890.00', 'TikTok', 'Google Ads'],
            ['cust_12348', 2, '$65.00', 'Email', 'Direct'],
            ['cust_12349', 4, '$340.00', 'Meta Ads', 'Meta Ads']
          ]}
        />
      </Card.Section>
    </Card>
  );

  const renderComparison = () => {
    const comparisonData = [
      { channel: 'Meta', first_click: 25000, last_click: 45200, linear: 35100, time_decay: 41000 },
      { channel: 'Google Ads', first_click: 18000, last_click: 32100, linear: 25050, time_decay: 29500 },
      { channel: 'Email', first_click: 12000, last_click: 18500, linear: 15250, time_decay: 17000 },
      { channel: 'Organic', first_click: 8000, last_click: 15600, linear: 11800, time_decay: 13800 },
      { channel: 'Direct', first_click: 5000, last_click: 8200, linear: 6600, time_decay: 7500 },
      { channel: 'TikTok', first_click: 3000, last_click: 3830, linear: 3415, time_decay: 3650 }
    ];

    return (
      <Card>
        <Card.Section title="Attribution Model Comparison">
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Legend />
                <Bar dataKey="first_click" fill="#8884d8" name="First Click" />
                <Bar dataKey="last_click" fill="#82ca9d" name="Last Click" />
                <Bar dataKey="linear" fill="#ffc658" name="Linear" />
                <Bar dataKey="time_decay" fill="#ff7300" name="Time Decay" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Section>
      </Card>
    );
  };

  return (
    <AppProvider i18n={translations}>
      <Head>
        <title>Attribution Dashboard</title>
      </Head>
      <Page
        title="Attribution Dashboard"
        subtitle="Multi-touch attribution analytics for your Shopify store"
        primaryAction={{ content: 'Export Report', onAction: () => {} }}
      >
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack distribution="fill">
                <Select
                  label="Time Range"
                  options={[
                    { label: 'Last 7 days', value: '7' },
                    { label: 'Last 30 days', value: '30' },
                    { label: 'Last 90 days', value: '90' }
                  ]}
                  value={timeRange}
                  onChange={setTimeRange}
                />
                <Select
                  label="Attribution Model"
                  options={[
                    { label: 'First Click', value: 'first_click' },
                    { label: 'Last Click', value: 'last_click' },
                    { label: 'Linear', value: 'linear' },
                    { label: 'Time Decay', value: 'time_decay' }
                  ]}
                  value={attributionModel}
                  onChange={setAttributionModel}
                />
              </Stack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
              <div style={{ marginTop: '20px' }}>
                {selectedTab === 0 && renderOverview()}
                {selectedTab === 1 && renderChannels()}
                {selectedTab === 2 && renderJourneys()}
                {selectedTab === 3 && renderComparison()}
              </div>
            </Tabs>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
