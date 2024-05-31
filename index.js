import React, { useCallback, useState } from 'react';
import { WebView } from 'react-native-webview';

const defaultOptions = {
	messageStyle: 'none',
	extensions: ['tex2jax.js'],
	jax: ['input/TeX', 'output/HTML-CSS'],
	tex2jax: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		displayMath: [['$$', '$$'], ['\\[', '\\]']],
		processEscapes: true,
	},
	TeX: {
		extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
	},
	asciimath2jax: {
		delimiters: [['`','`'], ['$','$']]
	}
};

const MathJax = (props) => {
    const [height, setHeight] = useState(1);

    const handleMessage = useCallback((message) => {
        setHeight(Number(message.nativeEvent.data));
    }, []);

    const wrapMathjax = (content) => {
        const options = JSON.stringify(
            Object.assign({}, defaultOptions, props.mathJaxOptions)
        );

        return `
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
            <script type="text/x-mathjax-config">
                MathJax.Hub.Config(${options});

                MathJax.Hub.Queue(function() {
                    var height = document.documentElement.scrollHeight;
                    window.ReactNativeWebView.postMessage(String(height));
                    document.getElementById("formula").style.visibility = '';
                });
            </script>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=AM_SVG"></script>
            <div id="formula" style="visibility: 'hidden'; ${props.cssStyles}">
                ${content}
            </div>
        `;
    };

    const html = wrapMathjax(props.html);

    return (
        <WebView
            scrollEnabled={false}
            onMessage={handleMessage}
            source={{ html }}
            style={{ height, ...props.style}}
        />
    );
};

export default MathJax;
