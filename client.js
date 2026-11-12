window.__ModuleLoader__.load({
	id: "dsh-desktop-folders",
	factory: (require) => {
		const React = require("react");
		const h = React.createElement;

		/** Locale namespace owned by this plugin. */
		const NS = "desktop-folders";

		/* ------------------------------------------------------------------ */
		/* Styles                                                              */
		/* ------------------------------------------------------------------ */
		const CSS = `
			.ddf-page { max-width: 520px; padding: 4px 0 16px; font-family: inherit; }
			.ddf-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; border: 1px solid color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent); background: color-mix(in srgb, var(--dsw-alias-label-secondary) 5%, transparent); }
			.ddf-row + .ddf-row { margin-top: 8px; }
			.ddf-text { flex: 1; min-width: 0; }
			.ddf-path { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; line-height: 18px; color: var(--dsw-alias-label-primary); word-break: break-all; }
			.ddf-sub { margin-top: 2px; font-size: 11.5px; line-height: 16px; color: var(--dsw-alias-label-secondary); }
			.ddf-btn { flex: none; border: none; border-radius: 9px; padding: 6px 12px; font-size: 12px; line-height: 17px; font-weight: 600; cursor: pointer; background: color-mix(in srgb, var(--dsw-alias-label-secondary) 14%, transparent); color: var(--dsw-alias-label-primary); transition: background .16s ease; }
			.ddf-btn:hover { background: color-mix(in srgb, var(--dsw-alias-label-secondary) 24%, transparent); }
			.ddf-btn[disabled] { opacity: .5; cursor: default; }
			.ddf-connect { width: 100%; margin-top: 10px; padding: 9px 14px; border-radius: 12px; border: 1px dashed color-mix(in srgb, var(--dsw-alias-label-primary) 22%, transparent); background: transparent; font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary); cursor: pointer; }
			.ddf-connect:hover { background: color-mix(in srgb, var(--dsw-alias-label-secondary) 8%, transparent); }
			.ddf-connect[disabled] { opacity: .5; cursor: default; }
			.ddf-hint { margin-top: 10px; padding: 0 4px; font-size: 11.5px; line-height: 17px; color: var(--dsw-alias-label-tertiary); }
			.ddf-empty { padding: 14px; text-align: center; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
		`;

		/* ------------------------------------------------------------------ */
		/* Dictionaries                                                        */
		/* ------------------------------------------------------------------ */
		const zh = {
			"page.title": "本地文件夹",
			"page.sub": "连接后 DSH 可直接读写该文件夹，无需每次授权",
			"connect": "连接文件夹…",
			"connect.busy": "等待选择…",
			"revoke": "撤销",
			"empty": "还没有连接任何文件夹",
			"loading": "正在读取…",
			"connectedAt": "连接于 {time}",
			"busy": "处理中…",
			"hint.unavailable": "此设置仅 DSH Desktop（桌面壳）可用；当前在浏览器或其他客户端中，无需也无法在此配置。",
			"hint.desktop": "连接与撤销都会弹系统确认框；删除文件始终先确认、且只移入废纸篓。撤销后 DSH 不再能读写该文件夹（文件保留）。"
		};
		const en = {
			"page.title": "Local folders",
			"page.sub": "Connected folders are readable and writable by DSH without per-file approval",
			"connect": "Connect folder…",
			"connect.busy": "Waiting for picker…",
			"revoke": "Revoke",
			"empty": "No folders connected yet",
			"loading": "Loading…",
			"connectedAt": "Connected {time}",
			"busy": "Working…",
			"hint.unavailable": "Available in DSH Desktop (the shell app) only; nothing to configure in the browser or other clients.",
			"hint.desktop": "Connect and revoke both pop a native confirm dialog; deletion always asks first and only moves files to Trash. Revoking stops DSH access (files are kept)."
		};

		function interpolate(template, vars) {
			if (vars === undefined) return template;
			return String(template).replace(/\{(\w+)\}/g, (match, key) => vars[key] === undefined ? match : String(vars[key]));
		}

		function useT(locale) {
			const read = () => {
				try {
					const snapshot = locale && typeof locale.getLocale === "function" ? locale.getLocale() : null;
					return snapshot && typeof snapshot.id === "string" ? snapshot.id : "zh";
				} catch {
					return "zh";
				}
			};
			const [localeId, setLocaleId] = React.useState(read);
			React.useEffect(() => {
				if (!locale || typeof locale.subscribe !== "function") return;
				const update = () => setLocaleId(read());
				const dispose = locale.subscribe(update);
				return typeof dispose === "function" ? dispose : undefined;
			}, [locale]);
			const dict = String(localeId).toLowerCase().startsWith("en") ? en : zh;
			const fallback = React.useCallback((key, vars) => interpolate(dict[key] !== undefined ? dict[key] : key, vars), [dict]);
			return fallback;
		}

		function hasBridge() {
			return typeof window !== "undefined"
				&& window.dshBridge
				&& typeof window.dshBridge.folders === "function";
		}

		function fmtTime(iso, t) {
			try {
				const d = new Date(iso);
				if (Number.isNaN(d.getTime())) return iso || "";
				return d.toLocaleString();
			} catch {
				return iso || "";
			}
		}

		/* ------------------------------------------------------------------ */
		/* Folder management page in plugin settings                           */
		/* ------------------------------------------------------------------ */
		function FoldersPage({ locale }) {
			const t = useT(locale);
			const [folders, setFolders] = React.useState(null); // null = loading
			const [busy, setBusy] = React.useState(false);
			const [available] = React.useState(hasBridge);

			const refresh = React.useCallback(async () => {
				if (!hasBridge()) return;
				try {
					const r = await window.dshBridge.folders();
					setFolders(Array.isArray(r && r.folders) ? r.folders : []);
				} catch {
					setFolders([]);
				}
			}, []);

			React.useEffect(() => { refresh(); }, [refresh]);

			const connect = async () => {
				if (busy) return;
				setBusy(true);
				try {
					await window.dshBridge.connect();
					await refresh();
				} catch {
					/* dialog canceled or failed: list stays as-is */
				} finally {
					setBusy(false);
				}
			};

			const revoke = async (p) => {
				if (busy) return;
				setBusy(true);
				try {
					await window.dshBridge.revoke(p);
					await refresh();
				} catch {
					/* confirmation canceled: keep */
				} finally {
					setBusy(false);
				}
			};

			if (!available) {
				return h("div", { className: "ddf-page" },
					h("div", { className: "ddf-hint" }, t("hint.unavailable"))
				);
			}

			const list = folders === null
				? null
				: folders.length === 0
					? h("div", { className: "ddf-empty" }, t("empty"))
					: folders.map((f) => h("div", { className: "ddf-row", key: f.path },
						h("div", { className: "ddf-text" },
							h("div", { className: "ddf-path" }, f.path),
							h("div", { className: "ddf-sub" }, t("connectedAt", { time: fmtTime(f.connectedAt, t) }))
						),
						h("button", {
							type: "button",
							className: "ddf-btn",
							disabled: busy,
							onClick: () => revoke(f.path)
						}, t("revoke"))
					));

			return h("div", { className: "ddf-page" },
				h("div", { className: "ddf-row" },
					h("div", { className: "ddf-text" },
						h("div", { className: "ddf-path" }, t("page.title")),
						h("div", { className: "ddf-sub" }, t("page.sub"))
					)
				),
				list,
				folders === null ? h("div", { className: "ddf-empty" }, t("loading")) : null,
				h("button", {
					type: "button",
					className: "ddf-connect",
					disabled: busy,
					onClick: connect
				}, busy ? t("busy") : t("connect")),
				h("div", { className: "ddf-hint" }, t("hint.desktop"))
			);
		}

		/* ------------------------------------------------------------------ */
		/* Registration                                                        */
		/* ------------------------------------------------------------------ */
		function insertStyles(ctx) {
			if (typeof document === "undefined") return;
			const run = () => {
				const existing = document.querySelector('style[data-plugin-css="' + NS + '"]');
				if (existing !== null) {
					existing.textContent = CSS;
					return undefined;
				}
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-desktop-folders";
				tag.dataset.pluginCss = NS;
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => {
					if (tag.parentNode !== null) tag.parentNode.removeChild(tag);
				};
			};
			if (typeof ctx.effect === "function") ctx.effect(run, "desktop-folders: stylesheet");
			else run();
		}

		const INJECT = ["slots", "locale"];

		function apply(ctx) {
			ctx.inject(INJECT, mount);
		}

		function mount(ctx) {
			const locale = ctx.locale;

			insertStyles(ctx);
			ctx.effect(() => locale.register(NS, { zh, en }), "desktop-folders: dictionaries");

			ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register(
				{
					name: "plugins.bundle.config",
					key: "dsh-desktop-folders",
					locale: NS
				},
				() => h(FoldersPage, { locale })
			));
		}

		return { inject: INJECT, apply };
	}
});
