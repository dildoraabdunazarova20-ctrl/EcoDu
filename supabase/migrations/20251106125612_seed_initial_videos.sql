/*
  # Seed Initial Video Data

  ## Overview
  Populates the videos table with existing video content from the site.
  
  ## Data Inserted
  - 5 ecology education videos with proper metadata
  - Video slugs matching current HTML files
  - Thumbnails and descriptions from existing content
*/

-- Insert initial videos
INSERT INTO videos (title, description, video_url, slug, thumbnail_url) VALUES
  (
    'Plastik ifloslanish',
    'Plastik nega xavfli? U tabiatni qanday ifloslantiradi va biz uni kamaytirish uchun nimalar qilishimiz mumkinligi haqida bilib oling!',
    'https://www.youtube.com/embed/X7fd43sDWLw?si=OAB6FAmHA0KDZhTb',
    'plastik-ifloslanish',
    'plastik.jpg'
  ),
  (
    'O''rmonlar yo''qolishi',
    'Daraxtlar nima uchun kesiladi va bu tabiatga qanday zarar keltiradi? O''rmonlarning yo''qolishi va uni to''xtatish yo''llari haqida bilib oling!',
    'https://www.youtube.com/embed/GDFZ5qK-j1s?si=P1XP4G2uO8Mu5EMH',
    'o''rmonlar-kesilishi',
    'o''rmonlar.jpg'
  ),
  (
    'Havo ifloslanishi',
    'Havo nega ifloslanadi? Tutun, chang va gazlarning insonlar, hayvonlar va o''simliklarga qanday ta''sir o''tkazishini bilib oling!',
    'https://www.youtube.com/embed/-jhLhu9Xt7Q?si=qzE06WvdLMEUAfHg',
    'havo-ifloslanishi',
    'havo.jpg'
  ),
  (
    'Suv ifloslanishi',
    'Suv nima uchun ifloslanadi? Bu hayvonlar va odamlarning hayotiga qanday ta''sir qiladi va uni qanday bartaraf etish mumkinligi haqida bilib oling!',
    'https://www.youtube.com/embed/NAtU1bR1Wtk?si=pCHnBOJtoqtPMDIm',
    'suv-ifloslanishi',
    'suv.png'
  ),
  (
    'Yovvoyi tabiat',
    'Yovvoyi tabiatni asrash nimaga muhim? Hayvonlar, o''simliklar va ekotizimlarni saqlash yo''llari bilan tanishing!',
    'https://www.youtube.com/embed/MzzWdmI27zk?si=Ci_3Dj2eHiqKH4JA',
    'yovvyi-tabiat',
    'yovvoyitabiat.jpg'
  )
ON CONFLICT (slug) DO NOTHING;
