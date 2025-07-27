export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Painel de Administração
          </h1>
          <p className="text-gray-600 mb-8">
            Acesso aos testes e configurações do sistema Casa Alvite
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Teste Supabase - Experiences */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Teste Experiences
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Testar conexão e visualizar dados da tabela experiences
              </p>
              <a
                href="/experiences"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors inline-block"
              >
                Acessar →
              </a>
            </div>

            {/* Teste Supabase - Available Slots */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Teste Available Slots
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Testar conexão e visualizar dados da tabela available_slots
              </p>
              <a
                href="/available-slots"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors inline-block"
              >
                Acessar →
              </a>
            </div>

            {/* Novo: Teste Calendário */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-semibold">🗓️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Teste Calendário
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Visualizar e testar componente react-calendar para agendamentos
              </p>
              <a
                href="/calendar-test"
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors inline-block"
              >
                Acessar →
              </a>
            </div>

            {/* Status Supabase */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-3">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold">🔗</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Status da Integração Supabase
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">URL:</span>
                  <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                    https://zxrollngvafxiujqdyvu.supabase.co
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-medium">Configurado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voltar */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 