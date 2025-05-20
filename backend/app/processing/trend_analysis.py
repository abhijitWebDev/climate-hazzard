import pandas as pd
from sklearn.linear_model import LinearRegression
import pymannkendall as mk
import matplotlib.pyplot as plt
import io
import base64

def generate_trend_chart(years, counts, slope, intercept):
    plt.figure(figsize=(8, 4))
    plt.plot(years, counts, marker="o", label="Heatwaves per Year")
    # Add trend line
    trend_line = [slope * x + intercept for x in years]
    plt.plot(years, trend_line, color="red", linestyle="--", label="Trend Line")
    plt.xlabel("Year")
    plt.ylabel("Number of Heatwaves")
    plt.title("Heatwave Trend Over Time")
    plt.legend()
    plt.tight_layout()

    buffer = io.BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    chart_base64 = base64.b64encode(buffer.read()).decode("utf-8")
    plt.close()
    return chart_base64

def analyze_heatwave_trend(events):
    if not events:
        return {"error": "No events found."}

    df = pd.DataFrame(events)
    print("Trend DataFrame before date parsing:", df.head())  # Debug print
    try:
        df["year"] = pd.to_datetime(df["start"], format="%Y-%m-%d %H:%M:%S", errors="coerce").dt.year
    except Exception as e:
        print("Date parsing error:", e)
        df["year"] = pd.to_datetime(df["start"], errors="coerce").dt.year
    print("Trend DataFrame after date parsing:", df.head())  # Debug print

    yearly_counts = df.groupby("year").size().reset_index(name="count")

    # Rolling average (window=3 for example)
    yearly_counts["rolling_avg"] = yearly_counts["count"].rolling(window=3, min_periods=1).mean()

    # Linear Regression
    X = yearly_counts["year"].values.reshape(-1, 1)
    y = yearly_counts["count"].values
    reg = LinearRegression().fit(X, y)
    slope = reg.coef_[0]
    intercept = reg.intercept_

    # Mann-Kendall test
    mk_result = mk.original_test(yearly_counts["count"])

    percent_increase = ((y[-1] - y[0]) / y[0]) * 100 if y[0] > 0 else None

    # Generate Base64 Chart
    chart = generate_trend_chart(
        yearly_counts["year"].tolist(),
        yearly_counts["count"].tolist(),
        slope,
        intercept
    )

    return {
        "years": yearly_counts["year"].tolist(),
        "counts": yearly_counts["count"].tolist(),
        "rolling_avg": yearly_counts["rolling_avg"].tolist(),
        "slope": slope,
        "intercept": intercept,
        "percent_increase": percent_increase,
        "mk_p_value": mk_result.p,
        "mk_trend": mk_result.trend,
        "trend_chart_base64": chart
    }
