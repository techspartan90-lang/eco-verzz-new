import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple


class FeatureEngineer:
    """
    Feature engineering pipeline for time-series forecasting, lag features, and rolling statistics.
    """

    @classmethod
    def extract_time_features(cls, df: pd.DataFrame, date_column: str = "date") -> pd.DataFrame:
        df_feat = df.copy()
        df_feat[date_column] = pd.to_datetime(df_feat[date_column])
        df_feat["day_of_week"] = df_feat[date_column].dt.dayofweek
        df_feat["month"] = df_feat[date_column].dt.month
        df_feat["quarter"] = df_feat[date_column].dt.quarter
        df_feat["is_weekend"] = df_feat["day_of_week"].isin([5, 6]).astype(int)
        return df_feat

    @classmethod
    def create_lag_features(cls, series: pd.Series, lags: Tuple[int, ...] = (1, 7, 30)) -> pd.DataFrame:
        lag_dict = {}
        for lag in lags:
            lag_dict[f"lag_{lag}"] = series.shift(lag)
        return pd.DataFrame(lag_dict)
