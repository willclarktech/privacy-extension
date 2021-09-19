import { injectJavascriptInstrumentPageScript } from "@openwpm/webext-instrumentation";

injectJavascriptInstrumentPageScript(
	(window as any).openWpmContentScriptConfig || {}
);
delete (window as any).openWpmContentScriptConfig;
