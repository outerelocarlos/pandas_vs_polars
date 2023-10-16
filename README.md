# **PANDAS** vs. **POLARS**

## Preface

This **React** web application transforms a Jupyter notebook into a static HTML website, simultaneously generating a README markdown file that is easily readable on Github.
Despite its static nature, this is not a server-less application. To deploy it, run the following commands:
```
node server/server.js
npm start
```

## Introduction

**Pandas** is a cornerstone in the Python data science ecosystem. Its DataFrame structure has become synonymous with tabular data manipulation in Python. However, with the evolution of data science and the increasing sizes of datasets, there has been a push for more performant libraries. This is where **polars** comes into the picture.

**Polars** is a DataFrame library that's Rust-based, giving it a significant performance boost. Rust's memory-safety guarantees, along with its speed, make it an ideal choice for such data-intensive libraries.

In this notebook, we'll undertake a comprehensive comparison of these two powerful libraries. For that, we will overview:
* Their **syntax**
* Their **performance**
* Their **memory usage**

### Setup


```python
import io
import sys
import pandas as pd
import polars as pl
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
```

### Dataset Creation

For our evaluation, we'll use a dataset with 10 million rows, encompassing numerical data, dates, categories, and string data:


```python
size = 10**7
dates = pd.date_range('20200101', periods=size, freq='T')
categories = ['A', 'B', 'C', 'D', 'E']
strings = ['foo', 'bar', 'baz', 'qux', 'quux']

df_pandas = pd.DataFrame({
    'date': dates, 
    'value1': np.random.randn(size),
    'value2': np.random.rand(size),
    'category': np.random.choice(categories, size),
    'strings': np.random.choice(strings, size)
})

df_polars = pl.DataFrame({
    'date': dates, 
    'value1': np.random.randn(size),
    'value2': np.random.rand(size),
    'category': np.random.choice(categories, size),
    'strings': np.random.choice(strings, size)
})
```

## Syntax Comparison
### Selection


```python
# pandas
df_pandas[['date', 'value1', 'category']]

# polars
df_polars.select(['date', 'value1', 'category'])
```




<div><style>
.dataframe > thead > tr > th,
.dataframe > tbody > tr > td {
  text-align: right;
  white-space: pre-wrap;
}
</style>
<small>shape: (10_000_000, 3)</small><table border="1" class="dataframe"><thead><tr><th>date</th><th>value1</th><th>category</th></tr><tr><td>datetime[ns]</td><td>f64</td><td>str</td></tr></thead><tbody><tr><td>2020-01-01 00:00:00</td><td>-1.660257</td><td>&quot;D&quot;</td></tr><tr><td>2020-01-01 00:01:00</td><td>-0.583535</td><td>&quot;C&quot;</td></tr><tr><td>2020-01-01 00:02:00</td><td>0.414002</td><td>&quot;E&quot;</td></tr><tr><td>2020-01-01 00:03:00</td><td>1.647009</td><td>&quot;C&quot;</td></tr><tr><td>2020-01-01 00:04:00</td><td>0.646135</td><td>&quot;D&quot;</td></tr><tr><td>2020-01-01 00:05:00</td><td>0.865287</td><td>&quot;D&quot;</td></tr><tr><td>2020-01-01 00:06:00</td><td>-0.564416</td><td>&quot;B&quot;</td></tr><tr><td>2020-01-01 00:07:00</td><td>-0.051554</td><td>&quot;D&quot;</td></tr><tr><td>2020-01-01 00:08:00</td><td>-0.89351</td><td>&quot;C&quot;</td></tr><tr><td>2020-01-01 00:09:00</td><td>-0.394897</td><td>&quot;A&quot;</td></tr><tr><td>2020-01-01 00:10:00</td><td>0.376603</td><td>&quot;D&quot;</td></tr><tr><td>2020-01-01 00:11:00</td><td>0.438367</td><td>&quot;E&quot;</td></tr><tr><td>&hellip;</td><td>&hellip;</td><td>&hellip;</td></tr><tr><td>2039-01-05 10:28:00</td><td>-0.444064</td><td>&quot;E&quot;</td></tr><tr><td>2039-01-05 10:29:00</td><td>-0.234055</td><td>&quot;E&quot;</td></tr><tr><td>2039-01-05 10:30:00</td><td>-0.106212</td><td>&quot;A&quot;</td></tr><tr><td>2039-01-05 10:31:00</td><td>-0.439457</td><td>&quot;B&quot;</td></tr><tr><td>2039-01-05 10:32:00</td><td>1.222781</td><td>&quot;D&quot;</td></tr><tr><td>2039-01-05 10:33:00</td><td>0.597626</td><td>&quot;C&quot;</td></tr><tr><td>2039-01-05 10:34:00</td><td>0.853442</td><td>&quot;E&quot;</td></tr><tr><td>2039-01-05 10:35:00</td><td>-1.515611</td><td>&quot;B&quot;</td></tr><tr><td>2039-01-05 10:36:00</td><td>0.223195</td><td>&quot;B&quot;</td></tr><tr><td>2039-01-05 10:37:00</td><td>-0.457431</td><td>&quot;E&quot;</td></tr><tr><td>2039-01-05 10:38:00</td><td>0.437804</td><td>&quot;E&quot;</td></tr><tr><td>2039-01-05 10:39:00</td><td>-1.102284</td><td>&quot;C&quot;</td></tr></tbody></table></div>



### Filtering


```python
# pandas
df_pandas[df_pandas['value1'] > 0.5]

# polars
df_polars.filter(df_polars['value1'] > 0.5)
```




<div><style>
.dataframe > thead > tr > th,
.dataframe > tbody > tr > td {
  text-align: right;
  white-space: pre-wrap;
}
</style>
<small>shape: (3_086_424, 5)</small><table border="1" class="dataframe"><thead><tr><th>date</th><th>value1</th><th>value2</th><th>category</th><th>strings</th></tr><tr><td>datetime[ns]</td><td>f64</td><td>f64</td><td>str</td><td>str</td></tr></thead><tbody><tr><td>2020-01-01 00:03:00</td><td>1.647009</td><td>0.829525</td><td>&quot;C&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2020-01-01 00:04:00</td><td>0.646135</td><td>0.080701</td><td>&quot;D&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2020-01-01 00:05:00</td><td>0.865287</td><td>0.302995</td><td>&quot;D&quot;</td><td>&quot;foo&quot;</td></tr><tr><td>2020-01-01 00:17:00</td><td>0.759477</td><td>0.782525</td><td>&quot;A&quot;</td><td>&quot;quux&quot;</td></tr><tr><td>2020-01-01 00:18:00</td><td>1.497432</td><td>0.295881</td><td>&quot;D&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2020-01-01 00:19:00</td><td>0.733474</td><td>0.839076</td><td>&quot;D&quot;</td><td>&quot;quux&quot;</td></tr><tr><td>2020-01-01 00:20:00</td><td>1.64138</td><td>0.873472</td><td>&quot;A&quot;</td><td>&quot;quux&quot;</td></tr><tr><td>2020-01-01 00:21:00</td><td>0.515361</td><td>0.242656</td><td>&quot;C&quot;</td><td>&quot;quux&quot;</td></tr><tr><td>2020-01-01 00:25:00</td><td>1.864133</td><td>0.678871</td><td>&quot;C&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2020-01-01 00:35:00</td><td>0.645075</td><td>0.685261</td><td>&quot;E&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2020-01-01 00:38:00</td><td>1.359608</td><td>0.430323</td><td>&quot;C&quot;</td><td>&quot;foo&quot;</td></tr><tr><td>2020-01-01 00:43:00</td><td>1.390393</td><td>0.584423</td><td>&quot;C&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>&hellip;</td><td>&hellip;</td><td>&hellip;</td><td>&hellip;</td><td>&hellip;</td></tr><tr><td>2039-01-05 10:09:00</td><td>1.250716</td><td>0.013257</td><td>&quot;C&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2039-01-05 10:10:00</td><td>1.123564</td><td>0.806332</td><td>&quot;C&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2039-01-05 10:12:00</td><td>1.420268</td><td>0.344083</td><td>&quot;E&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2039-01-05 10:14:00</td><td>1.919578</td><td>0.569476</td><td>&quot;B&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2039-01-05 10:15:00</td><td>1.495101</td><td>0.642284</td><td>&quot;A&quot;</td><td>&quot;quux&quot;</td></tr><tr><td>2039-01-05 10:18:00</td><td>1.610724</td><td>0.103981</td><td>&quot;B&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2039-01-05 10:20:00</td><td>1.331914</td><td>0.773701</td><td>&quot;B&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2039-01-05 10:21:00</td><td>0.934323</td><td>0.166249</td><td>&quot;A&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2039-01-05 10:22:00</td><td>0.50231</td><td>0.053391</td><td>&quot;C&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2039-01-05 10:32:00</td><td>1.222781</td><td>0.144786</td><td>&quot;D&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2039-01-05 10:33:00</td><td>0.597626</td><td>0.587756</td><td>&quot;C&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2039-01-05 10:34:00</td><td>0.853442</td><td>0.413084</td><td>&quot;E&quot;</td><td>&quot;foo&quot;</td></tr></tbody></table></div>



### Grouping and Aggregation


```python
# pandas
df_pandas.groupby('category').agg({'value1': 'mean'})

# polars
df_polars.group_by('category').agg(pl.col('value1').mean().alias('mean_value'))
```




<div><style>
.dataframe > thead > tr > th,
.dataframe > tbody > tr > td {
  text-align: right;
  white-space: pre-wrap;
}
</style>
<small>shape: (5, 2)</small><table border="1" class="dataframe"><thead><tr><th>category</th><th>mean_value</th></tr><tr><td>str</td><td>f64</td></tr></thead><tbody><tr><td>&quot;D&quot;</td><td>0.000436</td></tr><tr><td>&quot;B&quot;</td><td>-0.000231</td></tr><tr><td>&quot;C&quot;</td><td>-0.000065</td></tr><tr><td>&quot;E&quot;</td><td>0.000582</td></tr><tr><td>&quot;A&quot;</td><td>0.000854</td></tr></tbody></table></div>



## Sorting


```python
# pandas
df_pandas.sort_values(by='value1')

# polars
df_polars.sort(by='value1')
```




<div><style>
.dataframe > thead > tr > th,
.dataframe > tbody > tr > td {
  text-align: right;
  white-space: pre-wrap;
}
</style>
<small>shape: (10_000_000, 5)</small><table border="1" class="dataframe"><thead><tr><th>date</th><th>value1</th><th>value2</th><th>category</th><th>strings</th></tr><tr><td>datetime[ns]</td><td>f64</td><td>f64</td><td>str</td><td>str</td></tr></thead><tbody><tr><td>2022-07-15 13:23:00</td><td>-5.831549</td><td>0.041652</td><td>&quot;A&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2033-07-08 06:14:00</td><td>-5.186498</td><td>0.635022</td><td>&quot;A&quot;</td><td>&quot;quux&quot;</td></tr><tr><td>2029-12-21 11:18:00</td><td>-5.143923</td><td>0.078158</td><td>&quot;C&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2031-01-02 18:08:00</td><td>-5.121641</td><td>0.965643</td><td>&quot;E&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2031-06-18 07:58:00</td><td>-5.113963</td><td>0.099104</td><td>&quot;D&quot;</td><td>&quot;foo&quot;</td></tr><tr><td>2034-09-28 17:01:00</td><td>-5.094482</td><td>0.978462</td><td>&quot;E&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2033-05-09 13:01:00</td><td>-5.085646</td><td>0.640827</td><td>&quot;C&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2034-01-03 01:25:00</td><td>-4.992672</td><td>0.417587</td><td>&quot;C&quot;</td><td>&quot;foo&quot;</td></tr><tr><td>2021-03-03 00:48:00</td><td>-4.954376</td><td>0.79567</td><td>&quot;A&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2031-07-07 00:29:00</td><td>-4.9365</td><td>0.855522</td><td>&quot;D&quot;</td><td>&quot;quux&quot;</td></tr><tr><td>2027-07-06 18:49:00</td><td>-4.918284</td><td>0.157998</td><td>&quot;E&quot;</td><td>&quot;baz&quot;</td></tr><tr><td>2037-09-15 11:35:00</td><td>-4.917222</td><td>0.740148</td><td>&quot;E&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>&hellip;</td><td>&hellip;</td><td>&hellip;</td><td>&hellip;</td><td>&hellip;</td></tr><tr><td>2030-06-25 17:17:00</td><td>4.60573</td><td>0.0762</td><td>&quot;B&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2021-06-26 19:15:00</td><td>4.610419</td><td>0.800321</td><td>&quot;D&quot;</td><td>&quot;foo&quot;</td></tr><tr><td>2030-10-14 08:22:00</td><td>4.615471</td><td>0.999172</td><td>&quot;C&quot;</td><td>&quot;foo&quot;</td></tr><tr><td>2025-08-15 10:21:00</td><td>4.621846</td><td>0.634542</td><td>&quot;E&quot;</td><td>&quot;foo&quot;</td></tr><tr><td>2026-10-19 00:42:00</td><td>4.623624</td><td>0.53949</td><td>&quot;B&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2022-08-30 04:04:00</td><td>4.670292</td><td>0.688804</td><td>&quot;B&quot;</td><td>&quot;qux&quot;</td></tr><tr><td>2025-09-21 08:37:00</td><td>4.731835</td><td>0.778657</td><td>&quot;C&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2037-07-29 11:40:00</td><td>4.744101</td><td>0.365955</td><td>&quot;B&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2029-08-18 04:46:00</td><td>4.868541</td><td>0.72357</td><td>&quot;D&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2032-08-03 23:27:00</td><td>4.917138</td><td>0.031975</td><td>&quot;A&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2024-02-19 00:22:00</td><td>4.923881</td><td>0.483599</td><td>&quot;C&quot;</td><td>&quot;bar&quot;</td></tr><tr><td>2026-07-19 19:26:00</td><td>5.150536</td><td>0.664699</td><td>&quot;C&quot;</td><td>&quot;qux&quot;</td></tr></tbody></table></div>



## Performance Comparison

We will now compare the time each library takes to complete a few common operations. However, let's first define two relevant functions:
* **capture_time**: measures, saves, and prints the computing time that a given/input function has taken to complete.
* **comparative_plot**: as its name suggests, this function creates a boxplot comparing the timings/performance of **pandas** and **polars**.


```python
def capture_time(function, label):
    """
    Capture the output of the timeit magic function.
    Arguments:
    - code_str: the code to time.
    - label: the label to prepend to the printed output.
    
    Returns:
    - result: the result of the %timeit magic function (an instance of timeit's TimeitResult)
    """
    # Execute the code and get the %timeit result object
    result = get_ipython().run_line_magic('timeit', '-o -q ' + function)
    
    # Print the custom formatted string
    mean_time = result.best * 1e3  # Convert to ms
    std_dev = (result.stdev * 1e3) / (result.loops**0.5)  # Standard error of the mean
    print(f"{label}: {mean_time:.2f} ms ± {std_dev:.2f} ms per loop (mean ± std. dev. of {result.repeat} runs, {result.loops} loops each)")
    
    return result

def comparative_plot(time_pandas, time_polars, process_name):
    # Convert from seconds to milliseconds for better readability
    time_pandas = [run / time_pandas.loops * 1e3 for run in time_pandas.all_runs]
    time_polars = [run / time_polars.loops * 1e3 for run in time_polars.all_runs]

    # Data
    data = time_pandas + time_polars
    labels = ['pandas'] * len(time_pandas) + ['polars'] * len(time_polars)

    # Create DataFrame
    df = pd.DataFrame({'Time (ms)': data, 'Library': labels})

    # Plot
    plt.figure(figsize=(10, 6))
    sns.boxplot(x='Library', y='Time (ms)', data=df, width=0.5)

    # Titles
    title = "Performance Comparison: " + process_name
    plt.title(title, fontsize=16, pad=15)  # pad to adjust distance of title from plot
    plt.suptitle("Each value is derived from 7 runs, 10 loops each", y=0.94, fontsize=10, color='grey')  # y to adjust subtitle

    # Adjusting layout
    plt.tight_layout()  # Auto adjust layout

    # Adjusting plot's position
    plt.subplots_adjust(left=0.1, right=0.9, top=0.85, bottom=0.1)  # Adjusting margins for the figure

    plt.show()
```

### Filtering


```python
def filter_pandas():
    return df_pandas[df_pandas['value1'] > 0.5]

def filter_polars():
    return df_polars.filter(df_polars['value1'] > 0.5)

time_pandas_filter = capture_time('filter_pandas()', 'pandas')
time_polars_filter = capture_time('filter_polars()', 'polars')

comparative_plot(time_pandas_filter, time_polars_filter, "Filtering")
```

    pandas: 173.93 ms ± 3.67 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
    polars: 86.46 ms ± 0.84 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
    


    
![png](./img/README_18_1.png)
    


### Grouping and Aggregation


```python
def group_pandas():
    return df_pandas.groupby('category').agg({'value1': 'mean'})

def group_polars():
    return df_polars.group_by('category').agg(pl.col('value1').mean().alias('mean_value'))

time_pandas_group = capture_time('group_pandas()', 'pandas')
time_polars_group = capture_time('group_polars()', 'polars')

comparative_plot(time_pandas_group, time_polars_group, "Grouping")
```

    pandas: 311.15 ms ± 6.93 ms per loop (mean ± std. dev. of 7 runs, 1 loops each)
    polars: 121.91 ms ± 1.65 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
    


    
![png](./img/README_20_1.png)
    


### Sorting


```python
def sort_pandas():
    return df_pandas.sort_values(by='value1')

def sort_polars():
    return df_polars.sort(by='value1')

time_pandas_sort = capture_time('sort_pandas()', 'pandas')
time_polars_sort = capture_time('sort_polars()', 'polars')

comparative_plot(time_pandas_sort, time_polars_sort, "Sorting")
```

    pandas: 2899.04 ms ± 98.93 ms per loop (mean ± std. dev. of 7 runs, 1 loops each)
    polars: 560.89 ms ± 43.37 ms per loop (mean ± std. dev. of 7 runs, 1 loops each)
    


    
![png](./img/README_22_1.png)
    


## Memory Usage


```python
import sys
pandas_memory = sys.getsizeof(df_pandas)
polars_memory = sum([df_polars[col].to_numpy().nbytes for col in df_polars.columns])

labels = ['pandas', 'polars']
memory = [pandas_memory, polars_memory]

# Plot
plt.figure(figsize=(10, 6))
sns.barplot(x=labels, y=memory, palette="inferno", hue=labels, legend=False)

# Titles
plt.title('Memory Usage Comparison')
plt.ylabel('Memory (bytes)')

# Adjusting layout
plt.tight_layout()  # Auto adjust layout

# Adjusting plot's position
plt.subplots_adjust(left=0.1, right=0.9, top=0.85, bottom=0.1)  # Adjusting margins for the figure

plt.show()
```


    
![png](./img/README_24_0.png)
    


## Conclusion

* **Syntax**: While **pandas** and **polars** share many similarities in terms of syntax, especially because they're both built around the DataFrame concept, there are differences. The method names and how they're invoked (e.g., chaining in polars) can differ.

* **Performance**: As demonstrated, **polars** tends to perform faster for certain operations, especially as the size of the data grows. This is largely attributed to its Rust backend, optimized for performance.

* **Memory**: Memory consumption is crucial, especially for larger datasets. As we can observe, the memory footprint can differ between the two, with **polars** typically being more efficient due to its memory-safe Rust backend.

Ultimately, the choice between **pandas** and **polars** should be based on the specific needs of your project. While **pandas** boasts extensive documentation and a larger community, **polars** offers speed and efficiency advantages that could be decisive, especially for more extensive datasets. Consider the trade-offs and choose wisely!
