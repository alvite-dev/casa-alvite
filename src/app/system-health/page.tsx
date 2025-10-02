'use client'

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Server, Globe } from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'loading' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  responseTime?: number;
  lastChecked?: Date;
}

interface SystemHealth {
  environment: HealthCheck;
  supabaseConnection: HealthCheck;
  availableSlots: HealthCheck;
  experiences: HealthCheck;
  overallStatus: 'healthy' | 'degraded' | 'down';
}

export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemHealth>({
    environment: { name: 'Variáveis de Ambiente', status: 'loading', message: 'Verificando...' },
    supabaseConnection: { name: 'Conexão Supabase', status: 'loading', message: 'Verificando...' },
    availableSlots: { name: 'API Available Slots', status: 'loading', message: 'Verificando...' },
    experiences: { name: 'API Experiences', status: 'loading', message: 'Verificando...' },
    overallStatus: 'degraded'
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const checkHealth = async () => {
    setIsRefreshing(true);
    
    const newHealth: SystemHealth = {
      environment: { name: 'Variáveis de Ambiente', status: 'loading', message: 'Verificando...' },
      supabaseConnection: { name: 'Conexão Supabase', status: 'loading', message: 'Verificando...' },
      availableSlots: { name: 'API Available Slots', status: 'loading', message: 'Verificando...' },
      experiences: { name: 'API Experiences', status: 'loading', message: 'Verificando...' },
      overallStatus: 'degraded'
    };

    // Check 1: Environment Variables
    try {
      const startTime = Date.now();
      const response = await fetch('/api/debug-env');
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      if (response.ok && data.hasUrl && data.hasKey) {
        newHealth.environment = {
          name: 'Variáveis de Ambiente',
          status: 'success',
          message: 'Todas as variáveis configuradas',
          details: {
            hasUrl: data.hasUrl,
            hasKey: data.hasKey,
            nodeEnv: data.nodeEnv,
            host: data.host
          },
          responseTime,
          lastChecked: new Date()
        };
      } else {
        newHealth.environment = {
          name: 'Variáveis de Ambiente',
          status: 'error',
          message: 'Variáveis de ambiente não configuradas',
          details: data,
          responseTime,
          lastChecked: new Date()
        };
      }
    } catch (error) {
      newHealth.environment = {
        name: 'Variáveis de Ambiente',
        status: 'error',
        message: `Erro ao verificar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        lastChecked: new Date()
      };
    }

    // Check 2: Supabase Connection
    try {
      const startTime = Date.now();
      const response = await fetch('/api/test-supabase');
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      if (response.ok && data.success) {
        newHealth.supabaseConnection = {
          name: 'Conexão Supabase',
          status: 'success',
          message: 'Conexão funcionando normalmente',
          details: data,
          responseTime,
          lastChecked: new Date()
        };
      } else {
        newHealth.supabaseConnection = {
          name: 'Conexão Supabase',
          status: 'error',
          message: data.error || 'Erro na conexão',
          details: data,
          responseTime,
          lastChecked: new Date()
        };
      }
    } catch (error) {
      newHealth.supabaseConnection = {
        name: 'Conexão Supabase',
        status: 'error',
        message: `Erro ao conectar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        lastChecked: new Date()
      };
    }

    // Check 3: Available Slots API
    try {
      const startTime = Date.now();
      const response = await fetch('/api/available-slots');
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        const slotsCount = data.length;
        const availableCount = data.filter((slot: any) => slot.is_available).length;
        
        newHealth.availableSlots = {
          name: 'API Available Slots',
          status: 'success',
          message: `${slotsCount} slots encontrados (${availableCount} disponíveis)`,
          details: {
            total: slotsCount,
            available: availableCount,
            sample: data.slice(0, 3)
          },
          responseTime,
          lastChecked: new Date()
        };
      } else {
        newHealth.availableSlots = {
          name: 'API Available Slots',
          status: 'error',
          message: data.error || 'Resposta inválida da API',
          details: data,
          responseTime,
          lastChecked: new Date()
        };
      }
    } catch (error) {
      newHealth.availableSlots = {
        name: 'API Available Slots',
        status: 'error',
        message: `Erro na API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        lastChecked: new Date()
      };
    }

    // Check 4: Experiences API
    try {
      const startTime = Date.now();
      const response = await fetch('/api/experiences');
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      if (response.ok && Array.isArray(data) && data.length > 0) {
        newHealth.experiences = {
          name: 'API Experiences',
          status: 'success',
          message: `${data.length} experiências encontradas`,
          details: {
            count: data.length,
            experiences: data.map((exp: any) => ({ name: exp.name, price: exp.price }))
          },
          responseTime,
          lastChecked: new Date()
        };
      } else {
        newHealth.experiences = {
          name: 'API Experiences',
          status: 'warning',
          message: 'Nenhuma experiência encontrada',
          details: data,
          responseTime,
          lastChecked: new Date()
        };
      }
    } catch (error) {
      newHealth.experiences = {
        name: 'API Experiences',
        status: 'error',
        message: `Erro na API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        lastChecked: new Date()
      };
    }

    // Determine overall status
    const checks = [newHealth.environment, newHealth.supabaseConnection, newHealth.availableSlots, newHealth.experiences];
    const errorCount = checks.filter(check => check.status === 'error').length;
    const warningCount = checks.filter(check => check.status === 'warning').length;
    
    if (errorCount === 0 && warningCount === 0) {
      newHealth.overallStatus = 'healthy';
    } else if (errorCount === 0) {
      newHealth.overallStatus = 'degraded';
    } else {
      newHealth.overallStatus = 'down';
    }

    setHealth(newHealth);
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'loading':
        return <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: HealthCheck['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'loading':
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getOverallStatusColor = () => {
    switch (health.overallStatus) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
        return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-cinza">Status do Sistema</h1>
            <button
              onClick={checkHealth}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-verde text-cream rounded-lg hover:bg-verde/90 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
          
          {/* Overall Status */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getOverallStatusColor()}`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
            Status Geral: {health.overallStatus === 'healthy' ? 'Saudável' : health.overallStatus === 'degraded' ? 'Degradado' : 'Fora do Ar'}
          </div>
          
          <p className="text-gray-600 mt-2">
            Última verificação: {lastRefresh.toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Health Checks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* Environment Check */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(health.environment.status)}`}>
            <div className="flex items-center gap-3 mb-3">
              <Server className="w-6 h-6 text-cinza" />
              <h3 className="text-lg font-semibold text-cinza">{health.environment.name}</h3>
              {getStatusIcon(health.environment.status)}
            </div>
            <p className="text-gray-700 mb-2">{health.environment.message}</p>
            {health.environment.responseTime && (
              <p className="text-xs text-gray-500">Tempo de resposta: {health.environment.responseTime}ms</p>
            )}
            {health.environment.details && (
              <details className="mt-3">
                <summary className="text-xs text-gray-600 cursor-pointer">Ver detalhes</summary>
                <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(health.environment.details, null, 2)}
                </pre>
              </details>
            )}
          </div>

          {/* Supabase Check */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(health.supabaseConnection.status)}`}>
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-6 h-6 text-cinza" />
              <h3 className="text-lg font-semibold text-cinza">{health.supabaseConnection.name}</h3>
              {getStatusIcon(health.supabaseConnection.status)}
            </div>
            <p className="text-gray-700 mb-2">{health.supabaseConnection.message}</p>
            {health.supabaseConnection.responseTime && (
              <p className="text-xs text-gray-500">Tempo de resposta: {health.supabaseConnection.responseTime}ms</p>
            )}
            {health.supabaseConnection.details && (
              <details className="mt-3">
                <summary className="text-xs text-gray-600 cursor-pointer">Ver detalhes</summary>
                <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(health.supabaseConnection.details, null, 2)}
                </pre>
              </details>
            )}
          </div>

          {/* Available Slots Check */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(health.availableSlots.status)}`}>
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-cinza" />
              <h3 className="text-lg font-semibold text-cinza">{health.availableSlots.name}</h3>
              {getStatusIcon(health.availableSlots.status)}
            </div>
            <p className="text-gray-700 mb-2">{health.availableSlots.message}</p>
            {health.availableSlots.responseTime && (
              <p className="text-xs text-gray-500">Tempo de resposta: {health.availableSlots.responseTime}ms</p>
            )}
            {health.availableSlots.details && (
              <details className="mt-3">
                <summary className="text-xs text-gray-600 cursor-pointer">Ver detalhes</summary>
                <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(health.availableSlots.details, null, 2)}
                </pre>
              </details>
            )}
          </div>

          {/* Experiences Check */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(health.experiences.status)}`}>
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-cinza" />
              <h3 className="text-lg font-semibold text-cinza">{health.experiences.name}</h3>
              {getStatusIcon(health.experiences.status)}
            </div>
            <p className="text-gray-700 mb-2">{health.experiences.message}</p>
            {health.experiences.responseTime && (
              <p className="text-xs text-gray-500">Tempo de resposta: {health.experiences.responseTime}ms</p>
            )}
            {health.experiences.details && (
              <details className="mt-3">
                <summary className="text-xs text-gray-600 cursor-pointer">Ver detalhes</summary>
                <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(health.experiences.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold text-cinza mb-4">Informações do Sistema</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Ambiente</div>
              <div className="font-medium">{process.env.NODE_ENV}</div>
            </div>
            <div>
              <div className="text-gray-600">Última Verificação</div>
              <div className="font-medium">{lastRefresh.toLocaleTimeString('pt-BR')}</div>
            </div>
            <div>
              <div className="text-gray-600">User Agent</div>
              <div className="font-medium text-xs truncate">{typeof window !== 'undefined' ? window.navigator.userAgent.split(' ')[0] : 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-600">Timezone</div>
              <div className="font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}