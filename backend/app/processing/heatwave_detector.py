def detect_heatwaves(df):
    # Calculate 95th percentile over full dataset
    threshold = df["max_temp"].quantile(0.95)
    
    # Flag days exceeding threshold
    df["is_hot"] = df["max_temp"] > threshold
    
    # Detect sequences of 3+ consecutive hot days
    df["group"] = (df["is_hot"] != df["is_hot"].shift()).cumsum()
    heatwaves = []
    for _, group in df.groupby("group"):
        if group["is_hot"].iloc[0] and len(group) >= 3:
            heatwaves.append({
                "start": group["date"].iloc[0],
                "end": group["date"].iloc[-1],
                "duration": len(group),
                "avg_temp": group["max_temp"].mean()
            })
    return heatwaves
