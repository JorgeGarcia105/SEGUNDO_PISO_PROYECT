-- Anexos como Documentos Externos (Google Drive)
-- Anexo A: Vacíos cerrados y puntos por ratificar
-- Anexo B: Matriz final de medidas
-- Anexo C: Formatos de control (1-5)
-- Anexo D: Glosario

do $$
declare
  carta_id uuid;
  actas_id uuid;
  anexo_a_id uuid;
  anexo_b_id uuid;
  anexo_c_id uuid;
  anexo_d_id uuid;
  formato_1_id uuid;
  formato_2_id uuid;
  formato_3_id uuid;
  formato_4_id uuid;
  formato_5_id uuid;
begin
  select id into carta_id from public.documents where title = 'Carta Interna 2do Piso RGSB.pdf' limit 1;
  select id into actas_id from public.documents where title = 'Asambleas Piso 2.pdf' limit 1;

  -- Documento: Anexo A
  insert into public.documents (title, document_type, description, status, is_immutable, drive_url, source_document_id)
  values (
    'Anexo A - Vacíos cerrados y puntos por ratificar',
    'documento_externo',
    'Tabla resumen de cada vacío detectado en la Carta actual, cómo queda cerrado en esta versión y qué debe decidir la Asamblea. Mientras tanto, cualquier situación no cubierta se tramita conforme al Artículo 55.',
    'publicado',
    true,
    'https://drive.google.com/file/d/ANEXO_A_VACIOS/view', -- REEMPLAZAR CON URL REAL DE GOOGLE DRIVE
    carta_id
  )
  on conflict do nothing
  returning id into anexo_a_id;

  -- Documento: Anexo B
  insert into public.documents (title, document_type, description, status, is_immutable, drive_url, source_document_id)
  values (
    'Anexo B - Matriz final de medidas',
    'documento_externo',
    'Tabla que reúne todas las medidas para que nadie tenga que buscarlas entre las páginas de la Carta.',
    'publicado',
    true,
    'https://drive.google.com/file/d/ANEXO_B_MATRIZ_MEDIDAS/view', -- REEMPLAZAR CON URL REAL DE GOOGLE DRIVE
    carta_id
  )
  on conflict do nothing
  returning id into anexo_b_id;

  -- Documento: Anexo C
  insert into public.documents (title, document_type, description, status, is_immutable, drive_url, source_document_id)
  values (
    'Anexo C - Formatos de control',
    'documento_externo',
    'Formato 1: Reporte de queja (Art. 46). Formato 2: Revisión de aseo (Art. 24). Formato 3: Registro de medidas (Cap. XII). Formato 4: Control de modificaciones (Art. 53). Formato 5: Acuse de recibo de la Carta (Arts. 77 y 81).',
    'publicado',
    true,
    'https://drive.google.com/file/d/ANEXO_C_FORMATOS/view', -- REEMPLAZAR CON URL REAL DE GOOGLE DRIVE
    carta_id
  )
  on conflict do nothing
  returning id into anexo_c_id;

  -- Documento: Anexo D
  insert into public.documents (title, document_type, description, status, is_immutable, drive_url, source_document_id)
  values (
    'Anexo D - Glosario',
    'documento_externo',
    'Definiciones para aplicar la Carta de manera uniforme.',
    'publicado',
    true,
    'https://drive.google.com/file/d/ANEXO_D_GLOSARIO/view', -- REEMPLAZAR CON URL REAL DE GOOGLE DRIVE
    carta_id
  )
  on conflict do nothing
  returning id into anexo_d_id;

  -- Formatos de control en tabla formats_control
  insert into public.formats_control (format_number, title, description, article_reference, template_content, drive_url, status)
  values
  (1, 'Formato 1 - Reporte de queja', 'Reporte estandarizado de queja conforme Art. 46', 'Art. 46', 'Campos: Fecha, Hora, Lugar, Persona involucrada, Descripción, Norma presuntamente incumplida, Evidencia disponible, Persona que reporta', 'https://drive.google.com/file/d/FORMATO_1_QUEJA/view', 'publicado'),
  (2, 'Formato 2 - Revisión de aseo', 'Registro de revisión de aseo conforme Art. 24', 'Art. 24', 'Campos: Nombre revisor, Habitación, Fecha, Hora, Resultado, Observaciones', 'https://drive.google.com/file/d/FORMATO_2_REVISION/view', 'publicado'),
  (3, 'Formato 3 - Registro de medidas', 'Registro histórico de medidas correctivas conforme Cap. XII', 'Cap. XII', 'Campos: Persona, Habitación, Conducta, Norma, Fecha, Medida, Estado, Fecha de cumplimiento', 'https://drive.google.com/file/d/FORMATO_3_MEDIDAS/view', 'publicado'),
  (4, 'Formato 4 - Control de modificaciones', 'Control de modificaciones a la Carta conforme Art. 53', 'Art. 53', 'Campos: Norma modificada, Texto anterior, Texto nuevo, Fecha aprobación, Instancia, Fecha vigencia', 'https://drive.google.com/file/d/FORMATO_4_MODIFICACIONES/view', 'publicado'),
  (5, 'Formato 5 - Acuse de recibo de la Carta', 'Confirmación de recepción de la Carta por residente conforme Arts. 77 y 81', 'Arts. 77, 81', 'Campos: Nombre residente, Habitación, Fecha recepción, Firma, Compromiso de cumplimiento', 'https://drive.google.com/file/d/FORMATO_5_ACUSE/view', 'publicado')
  on conflict (format_number) do update set
    title = excluded.title,
    description = excluded.description,
    article_reference = excluded.article_reference,
    template_content = excluded.template_content,
    drive_url = excluded.drive_url,
    status = excluded.status,
    updated_at = now();
end $$;