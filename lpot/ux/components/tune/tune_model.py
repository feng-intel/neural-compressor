# -*- coding: utf-8 -*-
# Copyright (c) 2021 Intel Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Generic tuning script."""

import argparse
from typing import Any


def parse_args() -> Any:
    """Parse input arguments."""
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--config",
        type=str,
        required=True,
        help="Path to yaml config.",
    )
    parser.add_argument(
        "--input-graph",
        type=str,
        required=False,
        help="Path to input model.",
    )
    parser.add_argument(
        "--output-graph",
        type=str,
        required=False,
        help="Output path for quantized model.",
    )
    return parser.parse_args()


def tune_model(
    input_graph: str,
    output_graph: str,
    config: str,
) -> None:
    """Execute tuning."""
    from lpot.quantization import Quantization

    quantizer = Quantization(config)
    quantized_model = quantizer(input_graph)
    quantized_model.save(output_graph)


if __name__ == "__main__":
    args = parse_args()
    tune_model(
        input_graph=args.input_graph,
        output_graph=args.output_graph,
        config=args.config,
    )
