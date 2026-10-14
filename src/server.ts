import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

interface Guide {
  id: string;
  name: string;
  type: string;
  rakaat: string;
  steps: string[];
}

interface Dua {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  meaning: string;
}

// Namoz o'qish tartiblari
const prayerGuides: Guide[] = [
  {
    id: 'bomdod-sunnat',
    name: 'Bomdod namozi sunnati',
    type: 'Sunnat',
    rakaat: '2 rakat',
    steps: [
      'Niyat qilinadi: "Yuzimni qiblaga qaratib, xolis Alloh uchun bugungi bomdod namozining ikki rakat sunnatini o\'qishni niyat qildim".',
      'Takbiri tahrima: "Allohu akbar" deb qo\'llar quloq barobarida ko\'tariladi va kindik ostida bog\'lanadi.',
      'Qiyom: Subhanaka duosi, so\'ng "A\'uzu-bismillah", "Fotiha" surasi va bir zam sura o\'qiladi.',
      'Ruku va Sajda bajarilib, 2-rakatga turiladi.',
      '2-rakatda ham Fotiha va zam sura o\'qilib, sajdadan so\'ng o\'tirib "Attahiyyat", "Salovat" va "Robbana" duolari o\'qilib salom beriladi.'
    ]
  },
  {
    id: 'bomdod-farz',
    name: 'Bomdod namozi farzi',
    type: 'Farz',
    rakaat: '2 rakat',
    steps: [
      'Iqomat aytiladi va sunnat kabi 2 rakat farz o\'qiladi.',
      'Bomdod farzida qiroat ovoz chiqarib o\'qilishi afzaldir.'
    ]
  },
  {
    id: 'peshin-sunnat1',
    name: 'Peshin namozi 1-sunnati',
    type: 'Sunnat',
    rakaat: '4 rakat',
    steps: [
      '4 rakat sunnat o\'qiladi. 2-rakatdan so\'ng faqat "Attahiyyat" o\'qilib 3-rakatga turiladi.',
      'Oxirgi qa\'dada "Attahiyyat", "Salovat" va "Robbana" duolari o\'qilib salom beriladi.'
    ]
  },
  {
    id: 'peshin-farz',
    name: 'Peshin namozi farzi',
    type: 'Farz',
    rakaat: '4 rakat',
    steps: [
      '1 va 2-rakatlarda Fotiha va zam sura, 3 va 4-rakatlarda faqat Fotiha surasi o\'qiladi.'
    ]
  },
  {
    id: 'peshin-sunnat2',
    name: 'Peshin namozi 2-sunnati',
    type: 'Sunnat',
    rakaat: '2 rakat',
    steps: ['2 rakat sunnat o\'qilib salom beriladi.']
  },
  {
    id: 'asr-farz',
    name: 'Asr namozi farzi',
    type: 'Farz',
    rakaat: '4 rakat',
    steps: ['Peshin farzi kabi 4 rakat o\'qiladi (sunnati yo\'q).']
  },
  {
    id: 'shom-farz',
    name: 'Shom namozi farzi',
    type: 'Farz',
    rakaat: '3 rakat',
    steps: [
      '1 va 2-rakatlarda Fotiha va zam sura o\'qilib, 2-rakatdan keyin "Attahiyyat" o\'qiladi.',
      '3-rakatga turib faqat Fotiha o\'qiladi va namoz tugatiladi.'
    ]
  },
  {
    id: 'shom-sunnat',
    name: 'Shom namozi sunnati',
    type: 'Sunnat',
    rakaat: '2 rakat',
    steps: ['2 rakat sunnat o\'qilib salom beriladi.']
  },
  {
    id: 'xufton-farz',
    name: 'Xufton namozi farzi',
    type: 'Farz',
    rakaat: '4 rakat',
    steps: ['4 rakat farz o\'qiladi.']
  },
  {
    id: 'xufton-sunnat',
    name: 'Xufton namozi sunnati',
    type: 'Sunnat',
    rakaat: '2 rakat',
    steps: ['2 rakat sunnat o\'qiladi.']
  },
  {
    id: 'vitr',
    name: 'Vitr namozi (Vojib)',
    type: 'Vojib',
    rakaat: '3 rakat',
    steps: [
      'Har uchala rakatida Fotiha va zam sura o\'qiladi.',
      '3-rakatda zam suradan keyin ruku qilmasdan "Allohu akbar" deb qo\'llar ko\'tarilib "Qunut" duosi o\'qiladi va ruku qilinadi.'
    ]
  }
];

// Duolar
const duas: Dua[] = [
  {
    id: 1,
    title: 'Sano (Subhanaka) duosi',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
    transliteration: 'Subhanakallohumma va bihamdika va tabarokasmuka va ta\'ala jadduka va la ilaha g\'oyruk.',
    meaning: 'Ey Allohim! Sening noming muborakdir. Shoning ulug\'dir. Sendan o\'zga iloh yo\'qdir.'
  },
  {
    id: 2,
    title: 'Attahiyyat duosi',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَصَلَوَاتُ وَالطَّيِّبَاتُ...',
    transliteration: 'At-tahiyyatu lillahi vas-solavatu vat-toyyibat...',
    meaning: 'Barcha moliyaviy, badaniy ibodatlar Alloh uchundir...'
  },
  {
    id: 3,
    title: 'Robbana atina',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Robbana atina fid-dunya hasanatan va fil axiroti hasanatan va qina \'azaban-nar.',
    meaning: 'Ey Robbimiz, bizga bu dunyoda ham, oxiratda ham yaxshilik bergin va bizni do\'zax azobidan saqlagin.'
  }
];

// API: Namoz vaqtlari
app.get('/api/prayer-times', async (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'Tashkent';
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Uzbekistan&method=3&school=1`
    );
    const data = await response.json();
    
    if (data.code === 200) {
      res.json({
        city,
        date: data.data.date.readable,
        hijri: `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`,
        timings: {
          Bomdod: data.data.timings.Fajr,
          Quyosh: data.data.timings.Sunrise,
          Peshin: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Shom: data.data.timings.Maghrib,
          Xufton: data.data.timings.Isha
        }
      });
    } else {
      res.status(400).json({ error: 'Ma\'lumot topilmadi' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// API: Namoz tartiblari
app.get('/api/guides', (req: Request, res: Response) => {
  res.json(prayerGuides);
});

// API: Duolar
app.get('/api/duas', (req: Request, res: Response) => {
  res.json(duas);
});

// API: Qur'on suralari
app.get('/api/quran/surahs', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: 'Xatolik' });
  }
});

// API: Sura oyatlari
app.get('/api/quran/surah/:id', async (req: Request, res: Response) => {
  const surahId = req.params.id;
  try {
    const arabicRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
    const arabicData = await arabicRes.json();

    const uzbekRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/uz.sodik`);
    const uzbekData = await uzbekRes.json();

    res.json({
      number: arabicData.data.number,
      name: arabicData.data.name,
      englishName: arabicData.data.englishName,
      englishNameTranslation: arabicData.data.englishNameTranslation,
      ayahs: arabicData.data.ayahs.map((ayah: any, index: number) => ({
        numberInSurah: ayah.numberInSurah,
        arabic: ayah.text,
        uzbek: uzbekData.data.ayahs[index] ? uzbekData.data.ayahs[index].text : ''
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Xatolik' });
  }
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Portal http://localhost:${PORT} manzilida ishlamoqda!`);
});