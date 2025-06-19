-- Insert Sample Quizzes
INSERT INTO quizzes (title, description, time_limit) VALUES
('General Knowledge Quiz', 'Test your general knowledge with this comprehensive quiz covering various topics.', 15),
('Science & Technology', 'Explore the world of science and technology with challenging questions.', 20),
('History & Geography', 'Journey through time and around the world with our history and geography quiz.', 18);

-- Insert Sample Questions for General Knowledge Quiz (ID: 1)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(1, 'What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'c'),
(1, 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'b'),
(1, 'Who painted the Mona Lisa?', 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo', 'c'),
(1, 'What is the largest ocean on Earth?', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 'd'),
(1, 'In which year did World War II end?', '1944', '1945', '1946', '1947', 'b');

-- Insert Sample Questions for Science & Technology Quiz (ID: 2)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(2, 'What does CPU stand for?', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit', 'a'),
(2, 'Which element has the chemical symbol "O"?', 'Gold', 'Silver', 'Oxygen', 'Iron', 'c'),
(2, 'What is the speed of light in vacuum?', '299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '298,792,458 m/s', 'a'),
(2, 'Who developed the theory of relativity?', 'Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking', 'b'),
(2, 'What is the smallest unit of matter?', 'Molecule', 'Atom', 'Electron', 'Proton', 'b');

-- Insert Sample Questions for History & Geography Quiz (ID: 3)
INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
(3, 'Which river is the longest in the world?', 'Amazon River', 'Nile River', 'Mississippi River', 'Yangtze River', 'b'),
(3, 'In which year did the Berlin Wall fall?', '1987', '1988', '1989', '1990', 'c'),
(3, 'What is the smallest country in the world?', 'Monaco', 'Vatican City', 'San Marino', 'Liechtenstein', 'b'),
(3, 'Who was the first person to walk on the moon?', 'Buzz Aldrin', 'Neil Armstrong', 'John Glenn', 'Alan Shepard', 'b'),
(3, 'Which ancient wonder of the world was located in Alexandria?', 'Hanging Gardens', 'Lighthouse of Alexandria', 'Colossus of Rhodes', 'Temple of Artemis', 'b');
