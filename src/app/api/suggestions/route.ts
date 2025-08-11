import { NextRequest, NextResponse } from 'next/server';
import { AISuggestion } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await request.json();

    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        name: '東京スカイツリー観光',
        description: '東京の新しいランドマークを訪れ、展望台からの絶景を楽しみましょう。',
        location: '東京都墨田区',
        duration: '3-4時間',
        cost: '2,000-3,000円',
        category: '観光',
      },
      {
        id: '2',
        name: '浅草寺と仲見世通り散策',
        description: '伝統的な日本文化を感じられる浅草エリアでお寺参りとお土産探し。',
        location: '東京都台東区',
        duration: '2-3時間',
        cost: '1,000-2,000円',
        category: '文化',
      },
      {
        id: '3',
        name: '上野動物園',
        description: 'パンダをはじめとした様々な動物たちに会える人気スポット。',
        location: '東京都台東区',
        duration: '4-5時間',
        cost: '600円',
        category: 'レジャー',
      },
      {
        id: '4',
        name: '原宿・表参道ショッピング',
        description: '最新のファッションやトレンドを楽しめるショッピングエリア。',
        location: '東京都渋谷区',
        duration: '3-4時間',
        cost: '5,000-10,000円',
        category: 'ショッピング',
      },
      {
        id: '5',
        name: '築地場外市場グルメツアー',
        description: '新鮮な海鮮料理や築地名物を味わう食べ歩きツアー。',
        location: '東京都中央区',
        duration: '2-3時間',
        cost: '3,000-5,000円',
        category: 'グルメ',
      },
      {
        id: '6',
        name: '皇居東御苑散策',
        description: '都心にある緑豊かな庭園で自然を感じながらのんびり散歩。',
        location: '東京都千代田区',
        duration: '2-3時間',
        cost: '無料',
        category: '自然',
      },
    ];

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json(mockSuggestions);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
