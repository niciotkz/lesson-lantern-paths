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

- Keep curriculum metadata and hour totals in `src/data/course.ts`; derive displayed totals from module durations so schedule changes stay consistent.
- Store research-based lesson materials separately from curriculum metadata, and render them through reusable learning components; undeveloped modules retain their existing placeholders.
- Keep module practice drafts in React session state shared across lesson navigation, with client-side text export; do not claim automatic or cross-device saving.
- Keep the module chronology in a dedicated presentation component, with URL-driven topic navigation and one shared canvas for inline/fullscreen views; scale a 1920×1080 desktop slide and reflow the same content on portrait phones for readable text.
- Keep each chronology topic's importance explanation and source IDs in the lesson data; resolve citations against the shared source catalog so slide content and attribution stay together.
- Reflow chronology slides based on the canvas width as well as portrait orientation, so a narrow lesson column never reduces presentation text to unreadable scaled text.
