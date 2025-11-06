/*
  # Seed Sample Quizzes

  ## Overview
  Adds sample quizzes with questions and options for each video.
  
  ## Data Inserted
  - 5 quizzes (one for each video)
  - Multiple questions per quiz with options
  - Correct answers marked for scoring
*/

-- Get video IDs for reference
DO $$
DECLARE
    v_plastik_id uuid;
    v_ormonlar_id uuid;
    v_havo_id uuid;
    v_suv_id uuid;
    v_yovvyi_id uuid;
    v_quiz_id uuid;
    v_q1_id uuid;
    v_q2_id uuid;
    v_q3_id uuid;
BEGIN
    -- Get video IDs
    SELECT id INTO v_plastik_id FROM videos WHERE slug = 'plastik-ifloslanish';
    SELECT id INTO v_ormonlar_id FROM videos WHERE slug = 'o''rmonlar-kesilishi';
    SELECT id INTO v_havo_id FROM videos WHERE slug = 'havo-ifloslanishi';
    SELECT id INTO v_suv_id FROM videos WHERE slug = 'suv-ifloslanishi';
    SELECT id INTO v_yovvyi_id FROM videos WHERE slug = 'yovvyi-tabiat';

    -- Quiz 1: Plastik ifloslanish
    INSERT INTO quizzes (video_id, title, description)
    VALUES (v_plastik_id, 'Plastik Ifloslanish Testi', 'Plastik ifloslanish haqidagi bilimingizni sinab ko''ring')
    RETURNING id INTO v_quiz_id;

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Plastik parchalanishi uchun qancha vaqt kerak?', 'C', 0) RETURNING id INTO v_q1_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q1_id, '1 yil', 'A', 0),
    (v_q1_id, '10 yil', 'B', 1),
    (v_q1_id, '100-1000 yil', 'C', 2),
    (v_q1_id, '5 yil', 'D', 3);

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Plastikni qayta ishlash nimaga yordam beradi?', 'B', 1) RETURNING id INTO v_q2_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q2_id, 'Plastikni ko''paytiradi', 'A', 0),
    (v_q2_id, 'Tabiatni asraydi', 'B', 1),
    (v_q2_id, 'Plastikni qimmatlashtiradi', 'C', 2),
    (v_q2_id, 'Hech narsaga', 'D', 3);

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Okean plastikidan eng ko''p zarar ko''rgan kimlar?', 'A', 2) RETURNING id INTO v_q3_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q3_id, 'Dengiz hayvonlari', 'A', 0),
    (v_q3_id, 'Qushlar', 'B', 1),
    (v_q3_id, 'O''simliklar', 'C', 2),
    (v_q3_id, 'Hasharotlar', 'D', 3);

    -- Quiz 2: O'rmonlar kesilishi
    INSERT INTO quizzes (video_id, title, description)
    VALUES (v_ormonlar_id, 'O''rmonlar Yo''qolishi Testi', 'O''rmonlar kesilishi haqidagi bilimingizni tekshiring')
    RETURNING id INTO v_quiz_id;

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'O''rmonlar nima uchun muhim?', 'C', 0) RETURNING id INTO v_q1_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q1_id, 'Chiroyli ko''rinadi', 'A', 0),
    (v_q1_id, 'Yog''och beradi', 'B', 1),
    (v_q1_id, 'Kislorod ishlab chiqaradi', 'C', 2),
    (v_q1_id, 'Soya beradi', 'D', 3);

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Daraxtlar nima qiladi?', 'B', 1) RETURNING id INTO v_q2_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q2_id, 'Faqat o''sadi', 'A', 0),
    (v_q2_id, 'Karbonat angidridni yutadi', 'B', 1),
    (v_q2_id, 'Shovqin chiqaradi', 'C', 2),
    (v_q2_id, 'Hech narsa qilmaydi', 'D', 3);

    -- Quiz 3: Havo ifloslanishi
    INSERT INTO quizzes (video_id, title, description)
    VALUES (v_havo_id, 'Havo Ifloslanishi Testi', 'Havo ifloslanishi haqida nimalarni bilasiz?')
    RETURNING id INTO v_quiz_id;

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Havo ifloslanishining asosiy sababi nima?', 'A', 0) RETURNING id INTO v_q1_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q1_id, 'Fabrika va transport chiqindilari', 'A', 0),
    (v_q1_id, 'Daraxtlar', 'B', 1),
    (v_q1_id, 'Bulutlar', 'C', 2),
    (v_q1_id, 'Shamol', 'D', 3);

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Toza havo uchun nima qilish kerak?', 'C', 1) RETURNING id INTO v_q2_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q2_id, 'Ko''proq mashina haydash', 'A', 0),
    (v_q2_id, 'Daraxtlarni kesish', 'B', 1),
    (v_q2_id, 'Daraxt ekish', 'C', 2),
    (v_q2_id, 'Hech narsa qilmaslik', 'D', 3);

    -- Quiz 4: Suv ifloslanishi
    INSERT INTO quizzes (video_id, title, description)
    VALUES (v_suv_id, 'Suv Ifloslanishi Testi', 'Suv ifloslanishi haqida bilimingizni sinab ko''ring')
    RETURNING id INTO v_quiz_id;

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Suv ifloslanishining sababi nima?', 'B', 0) RETURNING id INTO v_q1_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q1_id, 'Yomg''ir', 'A', 0),
    (v_q1_id, 'Sanoat va maishiy chiqindilar', 'B', 1),
    (v_q1_id, 'Baliqlar', 'C', 2),
    (v_q1_id, 'Quyosh', 'D', 3);

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Toza suvni qanday saqlash mumkin?', 'A', 1) RETURNING id INTO v_q2_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q2_id, 'Chiqindilarni daryoga tashlamaslik', 'A', 0),
    (v_q2_id, 'Ko''proq suv ishlatish', 'B', 1),
    (v_q2_id, 'Suvga zaharli moddalar qo''shish', 'C', 2),
    (v_q2_id, 'Suvni isrof qilish', 'D', 3);

    -- Quiz 5: Yovvoyi tabiat
    INSERT INTO quizzes (video_id, title, description)
    VALUES (v_yovvyi_id, 'Yovvoyi Tabiat Testi', 'Yovvoyi tabiatni asrash haqida bilimingiz')
    RETURNING id INTO v_quiz_id;

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Yovvoyi hayvonlarni nima xavf ostiga qo''yadi?', 'C', 0) RETURNING id INTO v_q1_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q1_id, 'Quyosh nuri', 'A', 0),
    (v_q1_id, 'Yomg''ir', 'B', 1),
    (v_q1_id, 'Yashash joylarining yo''qolishi', 'C', 2),
    (v_q1_id, 'Boshqa hayvonlar', 'D', 3);

    INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, order_index) VALUES
    (v_quiz_id, 'Ekotizim nima?', 'B', 1) RETURNING id INTO v_q2_id;
    INSERT INTO quiz_options (question_id, option_text, option_key, order_index) VALUES
    (v_q2_id, 'Faqat hayvonlar', 'A', 0),
    (v_q2_id, 'Hayvonlar, o''simliklar va ularning muhiti', 'B', 1),
    (v_q2_id, 'Faqat o''simliklar', 'C', 2),
    (v_q2_id, 'Faqat suv', 'D', 3);

END $$;
