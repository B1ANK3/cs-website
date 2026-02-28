<script lang="ts">
    import type { PageProps } from './$types';

    let { params }: PageProps = $props();
</script>

<h1>{params.event}</h1>

<p>Render markdown here with the content.</p>
