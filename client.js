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
			.ddf-mount { flex: none; display: inline-flex; align-items: center; gap: 5px; border: 0; border-radius: 999px; height: 26px; padding: 0 10px; font-size: 12px; line-height: 17px; font-weight: 600; cursor: pointer; background: transparent; color: var(--dsw-alias-label-tertiary); white-space: nowrap; max-width: 100%; transition: color .16s ease, background .16s ease; }
			.ddf-mount:hover { color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-interactive-bg-hover); }
			.ddf-mount[disabled] { opacity: .45; cursor: default; }
			.ddf-chip { flex: none; display: inline-flex; align-items: center; gap: 4px; max-width: 160px; height: 22px; padding: 0 4px 0 8px; border-radius: 999px; border: 0; background: transparent; color: var(--dsw-alias-label-tertiary); font-size: 11.5px; line-height: 16px; }
			.ddf-chip:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-secondary); }
			.ddf-chip-path { min-width: 0; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--dsw-alias-label-tertiary); }
			.ddf-chip-x { flex: none; border: 0; background: transparent; cursor: pointer; padding: 0 2px; font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-tertiary); border-radius: 999px; }
			.ddf-chip-x:hover { color: var(--dsw-alias-label-primary); }
			.ddf-mountrow { display: inline-flex; align-items: center; gap: 2px; vertical-align: middle; margin-left: 0; margin-right: auto; /* auto margin overrides the dock's justify-content:center and pins this row in the left safe zone, clear of the absolutely-centered native "+" */ min-width: 0; max-width: 200px; overflow-x: auto; scrollbar-width: none; }
			.ddf-mountrow::-webkit-scrollbar { display: none; }
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
		const mountZh = {
			"mount.button": "mount",
			"mount.unavailable": "仅在 DSH Desktop 中可用",
			"mount.busy": "选择中…",
			"mount.none": "本会话未挂载文件夹",
			"mount.off": "卸载",
			"mount.notify.connected": "已连接 {path}，可直接读写（也用命令 /macmount 管理）",
			"mount.notify.mounted": "已挂载 {path}",
			"mount.notify.cancel": "已取消，未挂载文件夹",
			"mount.heroHint": "选定后自动加入信任列表；发送第一条消息时挂载到该会话"
		};
		const mountEn = {
			"mount.button": "mount",
			"mount.unavailable": "Available in DSH Desktop only",
			"mount.busy": "Picking…",
			"mount.none": "No folder mounted in this session",
			"mount.off": "Unmount",
			"mount.notify.connected": "Connected {path}; it is now readable and writable (manage with /macmount)",
			"mount.notify.mounted": "Mounted {path}",
			"mount.notify.cancel": "Canceled — nothing mounted",
			"mount.heroHint": "Auto-trusted on pick; mounts to this session when you send the first message"
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
			"hint.desktop": "Connect and revoke both pop a native confirm dialog; deletion always asks first and only moves files to Trash. Revoking stops DSH access (files are kept).",
			...mountEn
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
		/* Session mount UI (Cowork-style): dock button + chips                */
		/* ------------------------------------------------------------------ */
		const MOUNT_NS = "desktop-folders";
		const PENDING_KEY = "dsh-desktop-folders.pending-mount";

		function pendingGet() {
			try { return window.localStorage.getItem(PENDING_KEY); } catch { return null; }
		}
		function pendingSet(p) {
			try { window.localStorage.setItem(PENDING_KEY, p); } catch { /* ignore */ }
		}
		function pendingClear() {
			try { window.localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
		}
		function hasMacmountEvent(events) {
			try {
				return events.some((ev) => ev?.type === "command/run" && ev?.data?.name === "macmount");
			} catch { return false; }
		}

		/** Derive mounted folder paths from the session log (mirror of the host plugin). */
		function mountsFromEvents(events) {
			const mounts = [];
			try {
				for (const ev of events) {
					if (ev?.type !== "command/run" || ev?.data?.name !== "macmount") continue;
					const raw = String(ev?.data?.args ?? "").trim();
					if (!raw || raw === "list") continue;
					if (raw === "clear") { mounts.length = 0; continue; }
					if (raw.startsWith("off ")) {
						const off = raw.slice(4).trim().replace(/^["']|["']$/g, "");
						const i = mounts.indexOf(off);
						if (i >= 0) mounts.splice(i, 1);
						continue;
					}
					const p = raw.replace(/^["']|["']$/g, "");
					if (!mounts.includes(p)) mounts.push(p);
				}
			} catch { /* malformed log; treat as empty */ }
			return mounts;
		}

		function MountDock({ useSession, t, ctx }) {
			const [busy, setBusy] = React.useState(false);
			const autoRan = React.useRef(false);
			const available = typeof window !== "undefined"
				&& window.dshBridge
				&& typeof window.dshBridge.pick === "function";
			// Live chip source: the session's own command/run history. The slot
			// standard kit hands us useSession (selector hook over the live
			// session store); subscribing to the session snapshot re-renders on
			// every command/run, which is exactly when chips change.
			const session = useSession ? useSession((s) => s) : null;
			const mounts = React.useMemo(
				() => session ? mountsFromEvents(session.events) : [],
				[session]
			);

			const notify = (level, key, vars) => {
				try {
					const actx = ctx.get("sessions")?.scope?.(session?.sessionId);
					if (actx === undefined) return;
					actx.get("conversation")?.input?.for?.(actx)?.notify?.(level, t(key, vars));
				} catch { /* notices are best-effort */ }
			};

			const mount = async () => {
				if (busy || !available) return;
				setBusy(true);
				try {
					const r = await window.dshBridge.pick({ mode: "dir", trust: true, title: "挂载为本会话工作区" });
					if (r.canceled || !r.paths || r.paths.length === 0) {
						notify("info", "mount.notify.cancel");
						return;
					}
					const p = r.paths[0];
					await ctx.remote.commands.execute(session.sessionId, `/macmount ${p}`, []);
					notify("info", r.connected !== null ? "mount.notify.connected" : "mount.notify.mounted", { path: p });
				} catch (error) {
					notify("error", "mount.notify.cancel");
				} finally {
					setBusy(false);
				}
			};

			const unmount = async (p) => {
				if (busy || !session) return;
				try {
					await ctx.remote.commands.execute(session.sessionId, `/macmount off ${p}`, []);
				} catch { /* the host command surfaces its own errors */ }
			};

			// New-session flow: a folder picked on the hero screen is stashed in
			// localStorage; the moment this session exists, mount it once.
			React.useEffect(() => {
				if (!session || autoRan.current) return;
				const pending = pendingGet();
				if (!pending) return;
				autoRan.current = true;
				pendingClear();
				if (hasMacmountEvent(session.events)) return;
				ctx.remote.commands.execute(session.sessionId, `/macmount ${pending}`, [])
					.then(() => notify("info", "mount.notify.mounted", { path: pending }))
					.catch(() => { /* the chip state stays visible via the dock */ });
			}, [session]);

			// No bridge (plain browser / other clients): the picker cannot open,
			// so render nothing instead of a dead pill overlapping the composer.
			if (!available) {
				return null;
			}

			return h("div", { className: "ddf-mountrow" },
				h("button", {
					type: "button",
					className: "ddf-mount",
					title: t("mount.button"),
					disabled: busy || !session,
					onClick: mount
				}, busy ? t("mount.busy") : t("mount.button")),
				mounts.map((p) => h("span", { className: "ddf-chip", key: p },
					h("span", { className: "ddf-chip-path", title: p }, p.split("/").pop() || p),
					h("button", {
						type: "button",
						className: "ddf-chip-x",
						title: t("mount.off"),
						disabled: busy,
						onClick: () => unmount(p)
					}, "×")
				))
			);
		}

		/** Hero (brand-new session) mount: pick now, auto-mount when the session is born. */
		function HeroMount({ t, ctx }) {
			const [busy, setBusy] = React.useState(false);
			const [picked, setPicked] = React.useState(() => pendingGet());
			const available = typeof window !== "undefined"
				&& window.dshBridge
				&& typeof window.dshBridge.pick === "function";

			const mount = async () => {
				if (busy || !available) return;
				setBusy(true);
				try {
					const r = await window.dshBridge.pick({ mode: "dir", trust: true, title: "挂载为本会话工作区" });
					if (!r.canceled && r.paths && r.paths.length > 0) {
						pendingSet(r.paths[0]);
						setPicked(r.paths[0]);
					}
				} catch { /* picker canceled or failed; stay silent */ } finally {
					setBusy(false);
				}
			};

			// No bridge: render nothing (the picker cannot open on the web).
			if (!available) {
				return null;
			}

			const label = picked
				? "mount · " + (picked.split("/").pop() || picked)
				: t("mount.button");
			return h("button", {
				type: "button",
				className: "ddf-mount",
				title: picked ? picked + " — " + t("mount.heroHint") : t("mount.heroHint"),
				disabled: busy,
				onClick: mount
			}, busy ? t("mount.busy") : label);
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

		const INJECT = ["slots", "locale", "sessions", "remote", "remote.commands"];

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

			// Cowork-style session mount: button + chips next to the composer.
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register(
				{
					name: "conversation.composer.dock",
					id: "dsh-desktop-folders-mount",
					order: -2,
					locale: NS
				},
				(props) => h(MountDock, { ...props, ctx })
			));

			// New-session hero screen: this slot renders before a sessionId
			// exists (all composer.dock/input.* slots are sessionId-gated).
			// The slot is single-occupant: registering it shadows the host's own
			// agent-preset (mode) selector. Only claim it where the picker can
			// actually open (desktop shell); on the web, stay out of the way.
			const heroAvailable = typeof window !== "undefined"
				&& window.dshBridge
				&& typeof window.dshBridge.pick === "function";
			if (heroAvailable) ctx.slots.inject("conversation.hero.agentPreset", () => ctx.slots.register(
				{
					name: "conversation.hero.agentPreset",
					id: "dsh-desktop-folders-hero-mount",
					order: 10,
					locale: NS
				},
				(props) => h(HeroMount, { ...props, ctx })
			));
		}

		return { inject: INJECT, apply };
	}
});
