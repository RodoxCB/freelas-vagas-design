-- Seed data for development
INSERT INTO designers (nome, foto_url, area, nivel, bio, ferramentas, portfolio_url, whatsapp, disponibilidade, ocupado, localizacao, status) VALUES
  ('Ana Silva', NULL, 'UX/UI', 'Pleno', 'Designer de produto com foco em apps mobile e web.', ARRAY['Figma', 'FigJam', 'Maze'], 'https://behance.net', '5511999990001', ARRAY['Freelance', 'CLT'], false, 'São Paulo, SP', 'ativo'),
  ('Bruno Costa', NULL, 'Design Gráfico', 'Sênior', 'Especialista em branding e identidade visual.', ARRAY['Illustrator', 'Photoshop', 'InDesign'], 'https://dribbble.com', '5511999990002', ARRAY['Freelance'], false, 'Rio de Janeiro, RJ', 'ativo'),
  ('Carla Mendes', NULL, 'Motion', 'Júnior', 'Motion designer para redes sociais e vídeos curtos.', ARRAY['After Effects', 'Premiere'], 'https://behance.net', '5511999990003', ARRAY['Freelance', 'Estágio'], true, 'Belo Horizonte, MG', 'ativo'),
  ('Diego Alves', NULL, 'Produto', 'Sênior', 'Design lead com experiência em startups e scale-ups.', ARRAY['Figma', 'Framer', 'Notion'], 'https://linkedin.com', '5511999990004', ARRAY['CLT', 'Freelance'], false, 'Remoto', 'ativo');

INSERT INTO vagas (titulo, tipo, descricao, requisitos, contato_tipo, contato_valor, status) VALUES
  ('Designer UX/UI para app de saúde', 'freela', 'Buscamos designer para criar fluxos e telas de um app de telemedicina. Projeto de 2 meses, remoto.', 'Experiência com apps mobile, Figma, portfólio com cases de UX.', 'whatsapp', '5511999990001', 'ativa'),
  ('Estágio em Design Gráfico', 'estagio', 'Agência criativa busca estagiário para apoiar em peças para redes sociais e apresentações.', 'Cursando Design ou áreas afins, conhecimento em Adobe Creative Suite.', 'email', 'vagas@agencia.com.br', 'ativa');
