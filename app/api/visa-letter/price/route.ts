import { NextResponse } from 'next/server';
import dbConnect from '@/db/db';
import VisaLetterPrice from '@/db/models/visa-letter-price';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Country code is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const result = await VisaLetterPrice.findOne({ Code: code });

    if (!result) {
      return NextResponse.json(
        { error: 'Price not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
