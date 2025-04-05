export const isLastLevel = (object: object, levelKey: string): boolean => {
  const levels = Object.keys(object);
  return levelKey === levels[levels.length - 1];
};

export const textEllipsis = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export const generateSlug = (name: string): string => {
  return name.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/[^a-zA-Z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
          .replace(/^-|-$/g, '') // Trim hyphens from both ends
          .toLowerCase();
}



export const save = async (data: any, table: string, supabase: any) => {
  try {
    const { data: response, error } = await supabase
      .from(table)
      .insert([data])
      .select('*')
      .single();

    if (error) {
      throw error;
    }
    return response;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};

export const loadPDF = async (url: string, path: any) => {
  try {
    const { default: pdfFile } = await import((url + path.default).replace(/\/\//g, '/'));
    return pdfFile;
  } catch (error) {
    console.error('Error loading PDF:', error);
    return null;
  }
};