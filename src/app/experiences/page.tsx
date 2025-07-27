import { createServerClient } from '@/utils/supabase/server';

export default async function ExperiencesPage() {
  const supabase = createServerClient();
  const { data: experiences, error } = await supabase.from('experiences').select('*');

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Erro ao conectar com Supabase</h1>
        <pre className="bg-red-100 p-4 rounded">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão - Tabela Experiences</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Dados da tabela experiences:</h2>
        <p className="text-sm text-gray-600 mb-4">Total de registros: {experiences?.length || 0}</p>
        <pre className="overflow-auto max-h-96">{JSON.stringify(experiences, null, 2)}</pre>
      </div>
      
      <div className="mt-6">
        <a 
          href="/available-slots" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
        >
          Ver Available Slots
        </a>
        <a 
          href="/admin" 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-4"
        >
          Painel Admin
        </a>
        <a 
          href="/" 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
} 