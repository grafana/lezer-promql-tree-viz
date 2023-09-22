# Lezer-promql tree visualization
A simple application based off the logQL [tree visualization](https://github.com/grafana/lezer-logql/blob/main/tools/tree-viz.html).
Make sure to update the version of prometheus-io/lezer-promql in package.json to the version you are working with. By default, it's using the latest version used in Grafana.

To build default tree visualization:

```
npm run build
```

Then simply open the dist/index.html file in your browser.

To build against a local version of lezer-promql, make sure to follow the [instructions in lezer-promql](https://github.com/prometheus/prometheus/blob/main/web/ui/module/lezer-promql/README.md) and then update the package.json to point to the local version: 

    "@prometheus-io/lezer-promql": "file:/Users/USERNAME/projects/prometheus/web/ui/module/lezer-promql/dist",
