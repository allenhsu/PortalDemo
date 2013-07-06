//
//  LoginViewController.m
//  Portal
//
//  Created by Allen Hsu on 7/5/13.
//  Copyright (c) 2013 Allen Hsu. All rights reserved.
//

#import "LoginViewController.h"

@interface LoginViewController ()

- (void)didLogin:(id)sender;

@end

@implementation LoginViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)loadView
{
    [super loadView];
    UIButton *loginButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    loginButton.titleLabel.text = @"登录";
    [loginButton addTarget:self action:@selector(didLogin:) forControlEvents:UIControlEventTouchUpInside];
    loginButton.frame = CGRectMake(10.0, 10.0, 300.0, 44.0);
    [self.view addSubview:loginButton];
    self.view.backgroundColor = [UIColor whiteColor];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)didLogin:(id)sender
{
    if ([self.delegate respondsToSelector:@selector(loginViewControllerDidFinishLogin)]) {
        [self.delegate loginViewControllerDidFinishLogin];
    }
}

@end
