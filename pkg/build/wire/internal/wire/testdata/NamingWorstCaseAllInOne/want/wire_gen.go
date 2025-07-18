// Code generated by Wire. DO NOT EDIT.

//go:generate go run ./pkg/build/wire/cmd/wire/main.go
//go:build !wireinject

package main

import (
	context2 "context"
	"fmt"
	"os"
	"reflect"
)

// Injectors from foo.go:

func inject(context3 context2.Context, err2 struct{}) (context, error) {
	mainContext, err := Provide(context3)
	if err != nil {
		return context{}, err
	}
	return mainContext, nil
}

// foo.go:

type context struct{}

func main() {
	if _, ok := reflect.TypeOf(context{}).MethodByName("Provide"); !ok {
		fmt.Println("ERROR: context.Provide renamed")
		os.Exit(1)
	}
	c, err := inject(context2.Background(), struct{}{})
	if err != nil {
		fmt.Println("ERROR:", err)
		os.Exit(1)
	}
	fmt.Println(c)
}

func Provide(context2_2 context2.Context) (context, error) {
	var context3 = context2.Background()
	_ = context2_2
	_ = context3
	return context{}, nil
}

func (context) Provide() {
}
