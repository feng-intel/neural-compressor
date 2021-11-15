#!/bin/bash
# set -x

export GLOG_minloglevel=2

batch_size=32
function main {

  init_params "$@"
  run_benchmark

}

# init params
function init_params {
  iters=100
  for var in "$@"
  do
    case $var in
      --config=*)
          config=$(echo $var |cut -f2 -d=)
      ;;
      --input_model=*)
          input_model=$(echo $var |cut -f2 -d=)
      ;;
      --mode=*)
          mode=$(echo $var |cut -f2 -d=)
      ;;
      --batch_size=*)
          batch_size=$(echo $var |cut -f2 -d=)
      ;;
      --dataset_location=*)
          dataset_location=$(echo $var |cut -f2 -d=)
      ;;
    esac
  done

}


# run_tuning
function run_benchmark {
    python run_engine.py \
      --input_model=${input_model} \
      --raw_path=${dataset_location}/train.txt \
      --pro_data=${dataset_location}/kaggleAdDisplayChallenge_processed.npz \
      --batch_size=${batch_size} \
      --config=$config \
      --benchmark \
      --mode=$mode \

}

main "$@"
