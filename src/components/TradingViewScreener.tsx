import { useEffect, useRef, memo } from 'react';

function TradingViewScreener() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "width": "100%",
          "height": "100%",
          "defaultColumn": "overview",
          "defaultScreen": "general",
          "market": "crypto",
          "showToolbar": true,
          "colorTheme": "dark",
          "locale": "en"
        }`;

            if (container.current) {
                container.current.appendChild(script);
            }

            return () => {
                if (container.current) {
                    container.current.innerHTML = '';
                }
            }
        },
        []
    );

    return (
        <div className="tradingview-widget-container h-[80vh] w-full" ref={container}>
            <div className="tradingview-widget-container__widget h-full w-full"></div>
        </div>
    );
}

export default memo(TradingViewScreener);
