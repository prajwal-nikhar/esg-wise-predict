-- Clear existing questions
DELETE FROM public.esg_questions;

-- Insert new ESG questions for BFSI industry
INSERT INTO public.esg_questions (pillar, question_text, category, weight, order_index)
VALUES
-- Environmental
('environmental', 'Does the organization have a documented environmental sustainability policy?', 'Policy', 1.0, 1),
('environmental', 'Are Scope 1 and Scope 2 greenhouse gas emissions measured and reported annually?', 'Emissions', 1.0, 2),
('environmental', 'Are climate-related risks integrated into credit risk or investment decision-making?', 'Risk Management', 1.0, 3),
('environmental', 'What percentage of the loan/investment portfolio qualifies as green or sustainable financing?', 'Sustainable Finance', 1.0, 4),
('environmental', 'Does the organization have defined carbon-emission reduction targets with timelines?', 'Targets', 1.0, 5),
('environmental', 'What percentage of total customer transactions are conducted through digital or paperless channels?', 'Digitalization', 1.0, 6),
('environmental', 'Are environmental or climate-risk screening criteria applied while onboarding corporate clients?', 'Screening', 1.0, 7),
('environmental', 'Does the institution measure and disclose financed emissions arising from its lending and investment portfolio?', 'Financed Emissions', 1.0, 8),
('environmental', 'What percentage of the total credit/investment exposure is to carbon-intensive sectors (coal, oil, gas, heavy industry)?', 'Exposure', 1.0, 9),
('environmental', 'What percentage of operational energy consumption (branches, offices, data centers) is sourced from renewable energy?', 'Renewable Energy', 1.0, 10),
('environmental', 'Does the institution conduct climate-related stress testing on its credit and investment portfolio?', 'Stress Testing', 1.0, 11),
('environmental', 'Has the institution issued green, social, or sustainability bonds aligned with recognized frameworks?', 'Green Bonds', 1.0, 12),

-- Social
('social', 'Does the organization have a formal diversity and inclusion policy?', 'Diversity & Inclusion', 1.0, 13),
('social', 'Does the organization have structured employee health, safety, and well-being programs?', 'Health & Safety', 1.0, 14),
('social', 'Are data privacy and customer information protection policies implemented and enforced?', 'Data Privacy', 1.0, 15),
('social', 'What percentage of customer complaints are resolved within the defined regulatory timeline?', 'Customer Relations', 1.0, 16),
('social', 'Are ESG or ethical compliance requirements imposed on vendors and third-party partners?', 'Ethics & Compliance', 1.0, 17),
('social', 'How many material customer data breaches occurred in the last 3 years?', 'Data Security', 1.0, 18),
('social', 'Does the institution have mechanisms to prevent over-lending, mis-selling, or predatory financial practices?', 'Responsible Lending', 1.0, 19),
('social', 'What is the annual voluntary employee attrition rate?', 'Employee Relations', 1.0, 20),
('social', 'What is the average number of training hours provided per employee per year?', 'Training', 1.0, 21),
('social', 'Does the institution provide accessible banking services for elderly, disabled, and rural customers?', 'Accessibility', 1.0, 22),

-- Governance
('governance', 'What percentage of the Board of Directors comprises independent directors?', 'Board Composition', 1.0, 23),
('governance', 'Is ESG oversight assigned to a dedicated Board committee or senior leadership body?', 'ESG Oversight', 1.0, 24),
('governance', 'Is executive or senior management compensation linked to ESG or sustainability performance?', 'Executive Compensation', 1.0, 25),
('governance', 'Are Anti-Money Laundering (AML) and Know Your Customer (KYC) controls robustly enforced?', 'Compliance', 1.0, 26),
('governance', 'Does the organization have an effective whistleblower mechanism with protection against retaliation?', 'Whistleblower Policy', 1.0, 27),
('governance', 'Are ESG risks and performance disclosed through regulatory or voluntary sustainability reports?', 'Disclosure', 1.0, 28),
('governance', 'Is there a formal Code of Ethics applicable to all employees and management, with enforcement mechanisms?', 'Code of Ethics', 1.0, 29),
('governance', 'What percentage of board members possess formal risk management or financial expertise?', 'Board Expertise', 1.0, 30),
('governance', 'Has the institution faced material regulatory penalties in the last 3 years?', 'Regulatory History', 1.0, 31),
('governance', 'How robust are controls governing related-party transactions?', 'Related Party Transactions', 1.0, 32),
('governance', 'Does the internal audit function report independently to the Audit Committee?', 'Internal Audit', 1.0, 33),
('governance', 'Is ESG data independently verified or assured by external auditors?', 'Data Assurance', 1.0, 34);