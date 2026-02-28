<script lang="ts">
    import type { PageProps } from './$types';

    let { params }: PageProps = $props();

    // Use the author and article name to fetch from CMS
</script>

<h1>{params.article}</h1>
<h2>By: {params.author}</h2>
