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
