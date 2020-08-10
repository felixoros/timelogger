using System;
using Timelogger.Api.Factories.Interfaces;
using Timelogger.Api.Providers.Classes;
using Timelogger.Api.Providers.Interfaces;

namespace Timelogger.Api.Factories.Classes
{
    internal sealed class ProviderFactory: IProviderFactory
    {
        private readonly ApiContext _apiContext;
        
        public ProviderFactory(ApiContext apiContext)
        {
            _apiContext = apiContext ?? throw new ArgumentNullException(nameof(apiContext));
        }
        
        public IProjectProvider ProjectProvider => new ProjectProvider(_apiContext);
    }
}