import TradingViewScreener from '../../components/TradingViewScreener';

const Market = () => {
    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-3xl font-black">Market Overview</h1>
                <p className="text-text-muted mt-2">Analyze real-time market data across all available assets.</p>
            </div>

            <div className="card-gradient p-1 rounded-3xl overflow-hidden border border-white/5 min-h-[80vh]">
                <TradingViewScreener />
            </div>
        </div>
    );
};

export default Market;
