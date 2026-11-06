<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep live voice transport in the existing useLiveVoice hook; assistant controls call start directly from the opening click and stop on either close action, preserving media readiness and session cleanup.
- Apply site-wide presentation motion through Motion3D and Background3D, with reduced-motion guards, so page components do not manage animation listeners.
- Keep the entrance screen in the shared root as a temporary overlay with inert site content; it runs once per document load without adding redirects or repeating on internal navigation.
- Use CSS perspective for the entry screen's decorative growth columns, keeping its short animation lightweight and respecting reduced-motion preferences.
- Keep customer contact details and the contact-to-assistant event in one browser-safe module so every email action and chat entry uses the same destination.
- Generate client enquiry drafts from user turns in the shared contact module; require an editable preview and the visitor’s email app to send, so drafting never implies delivery.
- Keep company metrics and response commitments in the browser-safe company-facts module so pages and assistant instructions share the same values.
- Resolve company-profile media pointers against the Lovable-hosted site rather than the current origin so externally hosted copies can play the CDN assets.
- Typed chat (/api/chat) uses Lovable AI Gateway when LOVABLE_API_KEY exists and falls back to a host-injected OPENAI_API_KEY only on external copies; it always streams a readable message instead of an empty reply so visitors never see a silent failure.
