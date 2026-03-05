import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'onboarding');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const email = data.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
    const filename = `${timestamp}-${email}.json`;
    const filepath = path.join(dataDir, filename);
    
    // Save submission
    const submission = {
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    
    fs.writeFileSync(filepath, JSON.stringify(submission, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding submission received',
      filename 
    });
  } catch (error) {
    console.error('Onboarding submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save submission' },
      { status: 500 }
    );
  }
}
